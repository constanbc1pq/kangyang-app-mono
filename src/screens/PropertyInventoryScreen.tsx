/**
 * 财产清单管理页面
 * 帮助用户记录和管理所有资产和负债
 */

import React, { useState } from 'react';
import { Alert, RefreshControl, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, Input, TextArea, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Home,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Shield,
  Gem,
  Palette,
  Car,
  MoreHorizontal,
  FileText,
  MapPin,
  Trash2,
  Plus,
  Calendar,
} from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Asset, Liability } from '../types/legalService';
import {
  getPropertyInventories,
  createPropertyInventory,
  updatePropertyInventory,
} from '../services/legalService';
import { BottomSheet } from '@/components/BottomSheet';

const GOLD_COLOR = '#D4AF37';

type AssetCategory = Asset['category'];
type LiabilityType = Liability['type'];

const PropertyInventoryScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [activeTab, setActiveTab] = useState<'assets' | 'liabilities'>('assets');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPropertyData();
    setRefreshing(false);
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
      const totalLiabilityValue = liabilitiesList.reduce((sum, liability) => sum + liability.amount, 0);

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

  const getCategoryIcon = (category: AssetCategory) => {
    const iconProps = { size: 20, color: primaryColor };
    switch (category) {
      case 'real_estate': return <Home {...iconProps} />;
      case 'bank_deposit': return <CreditCard {...iconProps} />;
      case 'securities': return <TrendingUp {...iconProps} />;
      case 'insurance': return <Shield {...iconProps} />;
      case 'jewelry': return <Gem {...iconProps} />;
      case 'antique': return <Palette {...iconProps} />;
      case 'vehicle': return <Car {...iconProps} />;
      default: return <MoreHorizontal {...iconProps} />;
    }
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

  const assetCategories: AssetCategory[] = [
    'real_estate', 'bank_deposit', 'securities', 'insurance',
    'jewelry', 'antique', 'vehicle', 'other',
  ];

  const liabilityTypes: LiabilityType[] = [
    'mortgage', 'car_loan', 'personal_loan', 'credit_card', 'guarantee', 'other',
  ];

  const renderEmptyState = (type: 'assets' | 'liabilities') => (
    <YStack alignItems="center" justifyContent="center" padding="$6">
      <FileText size={64} color={theme.color5?.val} />
      <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$2">
        还没有{type === 'assets' ? '资产' : '负债'}记录
      </Text>
      <Text fontSize="$3" color="$color10" textAlign="center" marginTop="$1">
        记录您的{type === 'assets' ? '资产' : '负债'}有助于{type === 'assets' ? '财产规划和遗嘱订立' : '全面了解财务状况'}
      </Text>
    </YStack>
  );

  const renderTypeChip = (
    label: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <Pressable onPress={onPress} key={label}>
      <View
        paddingHorizontal="$2"
        paddingVertical="$1.5"
        borderRadius="$10"
        backgroundColor={isSelected ? '$primary' : '$color4'}
        marginRight="$2"
        marginBottom="$2"
      >
        <Text
          fontSize="$3"
          color={isSelected ? 'white' : '$color12'}
          fontWeight={isSelected ? '600' : '400'}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );

  const renderAssetsTab = () => {
    const assetsByCategory = getAssetsByCategory();
    const categories = Object.keys(assetsByCategory) as AssetCategory[];

    if (assets.length === 0) {
      return renderEmptyState('assets');
    }

    return (
      <YStack padding="$2.5" gap="$3">
        {categories.map(category => (
          <YStack key={category} gap="$2">
            <XStack alignItems="center" gap="$1.5">
              {getCategoryIcon(category)}
              <Text fontSize="$4" fontWeight="600" color="$color12" flex={1}>
                {getCategoryLabel(category)}
              </Text>
              <Text fontSize="$2" color="$color10">
                {assetsByCategory[category].length} 项
              </Text>
            </XStack>

            {assetsByCategory[category].map(asset => (
              <View
                key={asset.id}
                backgroundColor="$color2"
                borderRadius="$4"
                padding="$2"
                borderWidth={1}
                borderColor="$color5"
              >
                <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$1">
                  <Text fontSize="$3" fontWeight="600" color="$color12" flex={1}>
                    {asset.name}
                  </Text>
                  <Text fontSize="$4" fontWeight="600" color="$success">
                    ¥{asset.estimatedValue.toLocaleString()}
                  </Text>
                </XStack>

                {asset.description && (
                  <Text fontSize="$2" color="$color10" marginBottom="$1" lineHeight={18}>
                    {asset.description}
                  </Text>
                )}

                {asset.location && (
                  <XStack alignItems="center" gap="$1" marginBottom="$1">
                    <MapPin size={14} color={color10} />
                    <Text fontSize="$2" color="$color10">{asset.location}</Text>
                  </XStack>
                )}

                {asset.certificateNumber && (
                  <XStack alignItems="center" gap="$1" marginBottom="$1">
                    <FileText size={14} color={color10} />
                    <Text fontSize="$2" color="$color10">证件号：{asset.certificateNumber}</Text>
                  </XStack>
                )}

                <Pressable onPress={() => handleDeleteAsset(asset.id)}>
                  <XStack alignItems="center" gap="$0.5" alignSelf="flex-end" marginTop="$1">
                    <Trash2 size={14} color={errorColor} />
                    <Text fontSize="$2" color="$error">删除</Text>
                  </XStack>
                </Pressable>
              </View>
            ))}
          </YStack>
        ))}
      </YStack>
    );
  };

  const renderLiabilitiesTab = () => {
    if (liabilities.length === 0) {
      return renderEmptyState('liabilities');
    }

    return (
      <YStack padding="$2.5" gap="$2">
        {liabilities.map(liability => (
          <View
            key={liability.id}
            backgroundColor="$color2"
            borderRadius="$4"
            padding="$2"
            borderWidth={1}
            borderColor="$color5"
          >
            <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$1">
              <YStack flex={1}>
                <Text fontSize="$3" fontWeight="600" color="$color12">
                  {getLiabilityTypeLabel(liability.type)}
                </Text>
                <Text fontSize="$2" color="$color10">债权人：{liability.creditor}</Text>
              </YStack>
              <Text fontSize="$4" fontWeight="600" color="$error">
                -¥{liability.amount.toLocaleString()}
              </Text>
            </XStack>

            {liability.description && (
              <Text fontSize="$2" color="$color10" marginBottom="$1" lineHeight={18}>
                {liability.description}
              </Text>
            )}

            {liability.interestRate > 0 && (
              <XStack alignItems="center" gap="$1" marginBottom="$1">
                <TrendingUp size={14} color={color10} />
                <Text fontSize="$2" color="$color10">利率：{liability.interestRate}%</Text>
              </XStack>
            )}

            {liability.dueDate && (
              <XStack alignItems="center" gap="$1" marginBottom="$1">
                <Calendar size={14} color={color10} />
                <Text fontSize="$2" color="$color10">
                  到期日：{new Date(liability.dueDate).toLocaleDateString()}
                </Text>
              </XStack>
            )}

            <Pressable onPress={() => handleDeleteLiability(liability.id)}>
              <XStack alignItems="center" gap="$0.5" alignSelf="flex-end" marginTop="$1">
                <Trash2 size={14} color={errorColor} />
                <Text fontSize="$2" color="$error">删除</Text>
              </XStack>
            </Pressable>
          </View>
        ))}
      </YStack>
    );
  };

  const renderAddModal = () => (
    <BottomSheet
      visible={showAddModal}
      onClose={() => setShowAddModal(false)}
      title={`添加${activeTab === 'assets' ? '资产' : '负债'}`}
      variant="form"
      avoidKeyboard
      footer={
        <XStack gap="$2">
          <Pressable style={{ flex: 1 }} onPress={() => setShowAddModal(false)}>
            <View
              backgroundColor="$color4"
              borderRadius="$10"
              paddingVertical="$2"
              alignItems="center"
            >
              <Text fontSize="$3" color="$color12">取消</Text>
            </View>
          </Pressable>
          <Pressable
            style={{ flex: 2 }}
            onPress={activeTab === 'assets' ? handleAddAsset : handleAddLiability}
          >
            <View
              backgroundColor="$primary"
              borderRadius="$10"
              paddingVertical="$2"
              alignItems="center"
            >
              <Text fontSize="$3" fontWeight="600" color="white">添加</Text>
            </View>
          </Pressable>
        </XStack>
      }
    >
      <YStack gap="$3">
        {activeTab === 'assets' ? (
          <>
            <YStack gap="$1.5">
              <Text fontSize="$3" fontWeight="600" color="$color12">资产类型</Text>
              <XStack flexWrap="wrap">
                {assetCategories.map(category =>
                  renderTypeChip(
                    getCategoryLabel(category),
                    assetForm.category === category,
                    () => setAssetForm({ ...assetForm, category })
                  )
                )}
              </XStack>
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                资产名称 <Text color="$error">*</Text>
              </Text>
              <Input
                value={assetForm.name}
                onChangeText={text => setAssetForm({ ...assetForm, name: text })}
                placeholder="例如：北京朝阳区xx小区住宅"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">描述</Text>
              <TextArea
                value={assetForm.description}
                onChangeText={text => setAssetForm({ ...assetForm, description: text })}
                placeholder="详细描述"
                minHeight={80}
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                估值（元）<Text color="$error">*</Text>
              </Text>
              <Input
                value={assetForm.estimatedValue ? assetForm.estimatedValue.toString() : ''}
                onChangeText={text =>
                  setAssetForm({ ...assetForm, estimatedValue: parseFloat(text) || 0 })
                }
                placeholder="请输入估值"
                keyboardType="numeric"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">位置/账号</Text>
              <Input
                value={assetForm.location}
                onChangeText={text => setAssetForm({ ...assetForm, location: text })}
                placeholder="例如：地址、银行账号等"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">证件号码</Text>
              <Input
                value={assetForm.certificateNumber}
                onChangeText={text => setAssetForm({ ...assetForm, certificateNumber: text })}
                placeholder="例如：房产证号、股票账号等"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>
          </>
        ) : (
          <>
            <YStack gap="$1.5">
              <Text fontSize="$3" fontWeight="600" color="$color12">负债类型</Text>
              <XStack flexWrap="wrap">
                {liabilityTypes.map(type =>
                  renderTypeChip(
                    getLiabilityTypeLabel(type),
                    liabilityForm.type === type,
                    () => setLiabilityForm({ ...liabilityForm, type })
                  )
                )}
              </XStack>
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                债权人 <Text color="$error">*</Text>
              </Text>
              <Input
                value={liabilityForm.creditor}
                onChangeText={text => setLiabilityForm({ ...liabilityForm, creditor: text })}
                placeholder="例如：中国银行、信用卡公司等"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">
                金额（元）<Text color="$error">*</Text>
              </Text>
              <Input
                value={liabilityForm.amount ? liabilityForm.amount.toString() : ''}
                onChangeText={text =>
                  setLiabilityForm({ ...liabilityForm, amount: parseFloat(text) || 0 })
                }
                placeholder="请输入负债金额"
                keyboardType="numeric"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">利率（%）</Text>
              <Input
                value={liabilityForm.interestRate ? liabilityForm.interestRate.toString() : ''}
                onChangeText={text =>
                  setLiabilityForm({
                    ...liabilityForm,
                    interestRate: parseFloat(text) || 0,
                  })
                }
                placeholder="例如：5.5"
                keyboardType="numeric"
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                height={44}
              />
            </YStack>

            <YStack gap="$1">
              <Text fontSize="$3" fontWeight="600" color="$color12">描述</Text>
              <TextArea
                value={liabilityForm.description}
                onChangeText={text => setLiabilityForm({ ...liabilityForm, description: text })}
                placeholder="详细描述"
                minHeight={80}
                backgroundColor="$color2"
                borderWidth={1}
                borderColor="$color5"
                borderRadius="$3"
                fontSize="$4"
                paddingHorizontal="$2"
                paddingVertical="$2"
              />
            </YStack>
          </>
        )}
      </YStack>
    </BottomSheet>
  );

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View
        paddingTop={insets.top}
        backgroundColor="$color2"
        borderBottomWidth={1}
        borderBottomColor="$color5"
      >
        <XStack
          height={56}
          paddingHorizontal="$2.5"
          alignItems="center"
          justifyContent="space-between"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <View
              width={40}
              height={40}
              borderRadius={20}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">
            财产清单
          </Text>
          <View width={40} />
        </XStack>
      </View>

      {/* Stats */}
      <View backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack paddingVertical="$2" paddingHorizontal="$2.5">
          <YStack flex={1} alignItems="center">
            <Text fontSize="$2" color="$color10" marginBottom="$0.5">总资产</Text>
            <Text fontSize="$5" fontWeight="600" color="$success">
              ¥{getTotalAssetValue().toLocaleString()}
            </Text>
          </YStack>
          <YStack flex={1} alignItems="center">
            <Text fontSize="$2" color="$color10" marginBottom="$0.5">总负债</Text>
            <Text fontSize="$5" fontWeight="600" color="$error">
              ¥{getTotalLiabilityValue().toLocaleString()}
            </Text>
          </YStack>
          <YStack flex={1} alignItems="center">
            <Text fontSize="$2" color="$color10" marginBottom="$0.5">净资产</Text>
            <Text fontSize="$5" fontWeight="600" color="$primary">
              ¥{getNetWorth().toLocaleString()}
            </Text>
          </YStack>
        </XStack>
      </View>

      {/* Tabs */}
      <XStack backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('assets')}>
          <XStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderBottomWidth={2}
            borderBottomColor={activeTab === 'assets' ? '$primary' : 'transparent'}
            gap="$1"
          >
            <TrendingUp size={18} color={activeTab === 'assets' ? primaryColor : color10} />
            <Text
              fontSize="$3"
              color={activeTab === 'assets' ? '$primary' : '$color10'}
              fontWeight={activeTab === 'assets' ? '600' : '400'}
            >
              资产 ({assets.length})
            </Text>
          </XStack>
        </Pressable>

        <Pressable style={{ flex: 1 }} onPress={() => setActiveTab('liabilities')}>
          <XStack
            alignItems="center"
            justifyContent="center"
            paddingVertical="$2"
            borderBottomWidth={2}
            borderBottomColor={activeTab === 'liabilities' ? '$primary' : 'transparent'}
            gap="$1"
          >
            <TrendingDown size={18} color={activeTab === 'liabilities' ? primaryColor : color10} />
            <Text
              fontSize="$3"
              color={activeTab === 'liabilities' ? '$primary' : '$color10'}
              fontWeight={activeTab === 'liabilities' ? '600' : '400'}
            >
              负债 ({liabilities.length})
            </Text>
          </XStack>
        </Pressable>
      </XStack>

      {/* Content */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {activeTab === 'assets' ? renderAssetsTab() : renderLiabilitiesTab()}
        <View height={100} />
      </ScrollView>

      {/* Add Button */}
      <View
        paddingHorizontal="$2.5"
        paddingVertical="$2"
        paddingBottom={insets.bottom + 16}
        backgroundColor="$color2"
        borderTopWidth={1}
        borderTopColor="$color5"
      >
        <Pressable onPress={() => setShowAddModal(true)}>
          <XStack
            backgroundColor="$primary"
            borderRadius="$10"
            paddingVertical="$2"
            alignItems="center"
            justifyContent="center"
            gap="$1"
          >
            <Plus size={20} color="white" />
            <Text fontSize="$4" fontWeight="600" color="white">
              添加{activeTab === 'assets' ? '资产' : '负债'}
            </Text>
          </XStack>
        </Pressable>
      </View>

      {renderAddModal()}
    </View>
  );
};

export default PropertyInventoryScreen;
