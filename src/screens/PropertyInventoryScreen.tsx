/**
 * 财产清单管理页面
 * 帮助用户记录和管理所有资产和负债
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Asset, Liability } from '../types/legalService';
import {
  getPropertyInventories,
  createPropertyInventory,
  updatePropertyInventory,
} from '../services/legalService';
import { COLORS } from '@/constants/app';

type AssetCategory = Asset['category'];
type LiabilityType = Liability['type'];

const PropertyInventoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // 添加资产/负债的表单
  const [assetForm, setAssetForm] = useState<Partial<Asset>>({
    category: 'real_estate',
    name: '',
    description: '',
    estimatedValue: 0,
    location: '',
  });

  const [liabilityForm, setLiabilityForm] = useState<Partial<Liability>>({
    type: 'mortgage',
    creditor: '',
    amount: 0,
    interestRate: 0,
    description: '',
  });

  useFocusEffect(
    React.useCallback(() => {
      loadPropertyData();
    }, [])
  );

  const loadPropertyData = async () => {
    try {
      const inventories = await getPropertyInventories();
      if (inventories.length > 0) {
        setAssets(inventories[0].assets || []);
        setLiabilities(inventories[0].liabilities || []);
      }
    } catch (error) {
      console.error('Error loading property inventory:', error);
    }
  };

  const handleAddAsset = async () => {
    if (!assetForm.name || !assetForm.estimatedValue) {
      Alert.alert('提示', '请填写资产名称和估值');
      return;
    }

    const newAsset: Asset = {
      id: `asset_${Date.now()}`,
      category: assetForm.category as AssetCategory,
      name: assetForm.name,
      description: assetForm.description || '',
      estimatedValue: assetForm.estimatedValue,
      location: assetForm.location,
      acquisitionDate: assetForm.acquisitionDate,
      certificateNumber: assetForm.certificateNumber,
    };

    const newAssets = [...assets, newAsset];
    setAssets(newAssets);
    await saveInventory(newAssets, liabilities);

    // 重置表单
    setAssetForm({
      category: 'real_estate',
      name: '',
      description: '',
      estimatedValue: 0,
      location: '',
    });
    setShowAddModal(false);
  };

  const handleAddLiability = async () => {
    if (!liabilityForm.creditor || !liabilityForm.amount) {
      Alert.alert('提示', '请填写债权人和金额');
      return;
    }

    const newLiability: Liability = {
      id: `liability_${Date.now()}`,
      type: liabilityForm.type as LiabilityType,
      creditor: liabilityForm.creditor,
      amount: liabilityForm.amount,
      interestRate: liabilityForm.interestRate,
      dueDate: liabilityForm.dueDate,
      description: liabilityForm.description || '',
    };

    const newLiabilities = [...liabilities, newLiability];
    setLiabilities(newLiabilities);
    await saveInventory(assets, newLiabilities);

    // 重置表单
    setLiabilityForm({
      type: 'mortgage',
      creditor: '',
      amount: 0,
      interestRate: 0,
      description: '',
    });
    setShowAddModal(false);
  };

  const saveInventory = async (assetsList: Asset[], liabilitiesList: Liability[]) => {
    try {
      const inventories = await getPropertyInventories();
      const totalAssetValue = assetsList.reduce((sum, asset) => sum + asset.estimatedValue, 0);
      const totalLiabilityValue = liabilitiesList.reduce(
        (sum, liability) => sum + liability.amount,
        0
      );

      if (inventories.length > 0) {
        await updatePropertyInventory(inventories[0].id, {
          assets: assetsList,
          liabilities: liabilitiesList,
          totalAssetValue,
          totalLiabilityValue,
          netWorth: totalAssetValue - totalLiabilityValue,
        });
      } else {
        await createPropertyInventory({
          userId: 'current_user_id',
          assets: assetsList,
          liabilities: liabilitiesList,
          totalAssetValue,
          totalLiabilityValue,
          netWorth: totalAssetValue - totalLiabilityValue,
        });
      }
    } catch (error) {
      Alert.alert('错误', '保存失败，请重试');
      console.error('Error saving inventory:', error);
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    Alert.alert('删除资产', '确定要删除这项资产吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          const newAssets = assets.filter(a => a.id !== assetId);
          setAssets(newAssets);
          await saveInventory(newAssets, liabilities);
        },
      },
    ]);
  };

  const handleDeleteLiability = (liabilityId: string) => {
    Alert.alert('删除负债', '确定要删除这项负债吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          const newLiabilities = liabilities.filter(l => l.id !== liabilityId);
          setLiabilities(newLiabilities);
          await saveInventory(assets, newLiabilities);
        },
      },
    ]);
  };

  const getCategoryLabel = (category: AssetCategory): string => {
    const labels: Record<AssetCategory, string> = {
      real_estate: '房产',
      bank_deposit: '存款',
      securities: '股票证券',
      insurance: '保险',
      jewelry: '珠宝',
      antique: '古董',
      vehicle: '车辆',
      other: '其他',
    };
    return labels[category] || '未知';
  };

  const getLiabilityTypeLabel = (type: LiabilityType): string => {
    const labels: Record<LiabilityType, string> = {
      mortgage: '房贷',
      car_loan: '车贷',
      personal_loan: '个人贷款',
      credit_card: '信用卡',
      guarantee: '担保',
      other: '其他',
    };
    return labels[type] || '未知';
  };

  const getCategoryIcon = (category: AssetCategory): string => {
    const icons: Record<AssetCategory, string> = {
      real_estate: 'home-outline',
      bank_deposit: 'card-outline',
      securities: 'trending-up-outline',
      insurance: 'shield-checkmark-outline',
      jewelry: 'diamond-outline',
      antique: 'color-palette-outline',
      vehicle: 'car-outline',
      other: 'ellipsis-horizontal-outline',
    };
    return icons[category] || 'document-outline';
  };

  const getTotalAssetValue = (): number => {
    return assets.reduce((sum, asset) => sum + asset.estimatedValue, 0);
  };

  const getTotalLiabilityValue = (): number => {
    return liabilities.reduce((sum, liability) => sum + liability.amount, 0);
  };

  const getNetWorth = (): number => {
    return getTotalAssetValue() - getTotalLiabilityValue();
  };

  const getAssetsByCategory = (): Record<AssetCategory, Asset[]> => {
    return assets.reduce((acc, asset) => {
      if (!acc[asset.category]) {
        acc[asset.category] = [];
      }
      acc[asset.category].push(asset);
      return acc;
    }, {} as Record<AssetCategory, Asset[]>);
  };

  // 渲染资产标签页
  const renderAssetsTab = () => {
    const assetsByCategory = getAssetsByCategory();
    const categories = Object.keys(assetsByCategory) as AssetCategory[];

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {assets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#d9d9d9" />
            <Text style={styles.emptyText}>还没有资产记录</Text>
            <Text style={styles.emptyDescription}>
              记录您的资产有助于财产规划和遗嘱订立
            </Text>
          </View>
        ) : (
          <>
            {categories.map(category => (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Ionicons
                    name={getCategoryIcon(category) as any}
                    size={20}
                    color={COLORS.primary}
                  />
                  <Text style={styles.categoryTitle}>{getCategoryLabel(category)}</Text>
                  <Text style={styles.categoryCount}>
                    {assetsByCategory[category].length} 项
                  </Text>
                </View>

                {assetsByCategory[category].map(asset => (
                  <View key={asset.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{asset.name}</Text>
                      <Text style={styles.itemValue}>
                        ¥{asset.estimatedValue.toLocaleString()}
                      </Text>
                    </View>

                    {asset.description && (
                      <Text style={styles.itemDescription}>{asset.description}</Text>
                    )}

                    {asset.location && (
                      <View style={styles.itemDetail}>
                        <Ionicons name="location-outline" size={14} color="#999" />
                        <Text style={styles.itemDetailText}>{asset.location}</Text>
                      </View>
                    )}

                    {asset.certificateNumber && (
                      <View style={styles.itemDetail}>
                        <Ionicons name="document-text-outline" size={14} color="#999" />
                        <Text style={styles.itemDetailText}>
                          证件号：{asset.certificateNumber}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteAsset(asset.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#ff4d4f" />
                      <Text style={styles.deleteButtonText}>删除</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    );
  };

  // 渲染负债标签页
  const renderLiabilitiesTab = () => {
    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        {liabilities.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#d9d9d9" />
            <Text style={styles.emptyText}>还没有负债记录</Text>
            <Text style={styles.emptyDescription}>
              记录负债情况有助于全面了解财务状况
            </Text>
          </View>
        ) : (
          <View style={styles.liabilitiesList}>
            {liabilities.map(liability => (
              <View key={liability.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View>
                    <Text style={styles.itemName}>{getLiabilityTypeLabel(liability.type)}</Text>
                    <Text style={styles.itemSubtitle}>债权人：{liability.creditor}</Text>
                  </View>
                  <Text style={[styles.itemValue, { color: '#ff4d4f' }]}>
                    -¥{liability.amount.toLocaleString()}
                  </Text>
                </View>

                {liability.description && (
                  <Text style={styles.itemDescription}>{liability.description}</Text>
                )}

                {liability.interestRate > 0 && (
                  <View style={styles.itemDetail}>
                    <Ionicons name="trending-up-outline" size={14} color="#999" />
                    <Text style={styles.itemDetailText}>
                      利率：{liability.interestRate}%
                    </Text>
                  </View>
                )}

                {liability.dueDate && (
                  <View style={styles.itemDetail}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.itemDetailText}>
                      到期日：{new Date(liability.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteLiability(liability.id)}
                >
                  <Ionicons name="trash-outline" size={16} color="#ff4d4f" />
                  <Text style={styles.deleteButtonText}>删除</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  // 渲染添加模态框
  const renderAddModal = () => {
    return (
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                添加{activeTab === 'assets' ? '资产' : '负债'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {activeTab === 'assets' ? (
                <>
                  <Text style={styles.formLabel}>资产类型</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categorySelector}
                  >
                    {(
                      [
                        'real_estate',
                        'bank_deposit',
                        'securities',
                        'insurance',
                        'jewelry',
                        'antique',
                        'vehicle',
                        'other',
                      ] as AssetCategory[]
                    ).map(category => (
                      <TouchableOpacity
                        key={category}
                        style={[
                          styles.categoryButton,
                          assetForm.category === category && styles.categoryButtonActive,
                        ]}
                        onPress={() => setAssetForm({ ...assetForm, category })}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            assetForm.category === category && styles.categoryButtonTextActive,
                          ]}
                        >
                          {getCategoryLabel(category)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.formLabel}>资产名称 *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：北京朝阳区xx小区住宅"
                    value={assetForm.name}
                    onChangeText={text => setAssetForm({ ...assetForm, name: text })}
                  />

                  <Text style={styles.formLabel}>描述</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    placeholder="详细描述"
                    value={assetForm.description}
                    onChangeText={text => setAssetForm({ ...assetForm, description: text })}
                    multiline
                    numberOfLines={3}
                  />

                  <Text style={styles.formLabel}>估值（元）*</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="请输入估值"
                    value={
                      assetForm.estimatedValue ? assetForm.estimatedValue.toString() : ''
                    }
                    onChangeText={text =>
                      setAssetForm({ ...assetForm, estimatedValue: parseFloat(text) || 0 })
                    }
                    keyboardType="numeric"
                  />

                  <Text style={styles.formLabel}>位置/账号</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：地址、银行账号等"
                    value={assetForm.location}
                    onChangeText={text => setAssetForm({ ...assetForm, location: text })}
                  />

                  <Text style={styles.formLabel}>证件号码</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：房产证号、股票账号等"
                    value={assetForm.certificateNumber}
                    onChangeText={text =>
                      setAssetForm({ ...assetForm, certificateNumber: text })
                    }
                  />
                </>
              ) : (
                <>
                  <Text style={styles.formLabel}>负债类型</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categorySelector}
                  >
                    {(
                      ['mortgage', 'car_loan', 'personal_loan', 'credit_card', 'guarantee', 'other'] as LiabilityType[]
                    ).map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.categoryButton,
                          liabilityForm.type === type && styles.categoryButtonActive,
                        ]}
                        onPress={() => setLiabilityForm({ ...liabilityForm, type })}
                      >
                        <Text
                          style={[
                            styles.categoryButtonText,
                            liabilityForm.type === type && styles.categoryButtonTextActive,
                          ]}
                        >
                          {getLiabilityTypeLabel(type)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <Text style={styles.formLabel}>债权人 *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：中国银行、信用卡公司等"
                    value={liabilityForm.creditor}
                    onChangeText={text => setLiabilityForm({ ...liabilityForm, creditor: text })}
                  />

                  <Text style={styles.formLabel}>金额（元）*</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="请输入负债金额"
                    value={liabilityForm.amount ? liabilityForm.amount.toString() : ''}
                    onChangeText={text =>
                      setLiabilityForm({ ...liabilityForm, amount: parseFloat(text) || 0 })
                    }
                    keyboardType="numeric"
                  />

                  <Text style={styles.formLabel}>利率（%）</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="例如：5.5"
                    value={
                      liabilityForm.interestRate ? liabilityForm.interestRate.toString() : ''
                    }
                    onChangeText={text =>
                      setLiabilityForm({
                        ...liabilityForm,
                        interestRate: parseFloat(text) || 0,
                      })
                    }
                    keyboardType="numeric"
                  />

                  <Text style={styles.formLabel}>描述</Text>
                  <TextInput
                    style={[styles.formInput, styles.formTextArea]}
                    placeholder="详细描述"
                    value={liabilityForm.description}
                    onChangeText={text =>
                      setLiabilityForm({ ...liabilityForm, description: text })
                    }
                    multiline
                    numberOfLines={3}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitButton}
                onPress={activeTab === 'assets' ? handleAddAsset : handleAddLiability}
              >
                <Text style={styles.modalSubmitButtonText}>添加</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Title Bar */}
      <View style={styles.titleBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.titleText}>财产清单</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 顶部统计卡片 */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>总资产</Text>
          <Text style={[styles.statValue, { color: '#52c41a' }]}>
            ¥{getTotalAssetValue().toLocaleString()}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>总负债</Text>
          <Text style={[styles.statValue, { color: '#ff4d4f' }]}>
            ¥{getTotalLiabilityValue().toLocaleString()}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>净资产</Text>
          <Text style={[styles.statValue, { color: COLORS.primary }]}>
            ¥{getNetWorth().toLocaleString()}
          </Text>
        </View>
      </View>

      {/* 标签页切换 */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assets' && styles.tabActive]}
          onPress={() => setActiveTab('assets')}
        >
          <Ionicons
            name="trending-up-outline"
            size={20}
            color={activeTab === 'assets' ? COLORS.primary : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'assets' && styles.tabTextActive]}>
            资产 ({assets.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'liabilities' && styles.tabActive]}
          onPress={() => setActiveTab('liabilities')}
        >
          <Ionicons
            name="trending-down-outline"
            size={20}
            color={activeTab === 'liabilities' ? COLORS.primary : '#999'}
          />
          <Text
            style={[styles.tabText, activeTab === 'liabilities' && styles.tabTextActive]}
          >
            负债 ({liabilities.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 标签页内容 */}
      {activeTab === 'assets' ? renderAssetsTab() : renderLiabilitiesTab()}

      {/* 添加按钮 */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={styles.addButtonText}>
            添加{activeTab === 'assets' ? '资产' : '负债'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 添加模态框 */}
      {renderAddModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  backButton: {
    padding: 4,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placeholder: {
    width: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  categoryCount: {
    fontSize: 12,
    color: '#999',
  },
  liabilitiesList: {},
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  itemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52c41a',
  },
  itemDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemDetailText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#ff4d4f',
    marginLeft: 4,
  },
  addButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalBody: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  formTextArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    marginBottom: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#f3e5f5',
  },
  categoryButtonText: {
    fontSize: 13,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
  },
  modalCancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelButtonText: {
    fontSize: 15,
    color: '#666',
  },
  modalSubmitButton: {
    flex: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    padding: 14,
    alignItems: 'center',
  },
  modalSubmitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default PropertyInventoryScreen;
