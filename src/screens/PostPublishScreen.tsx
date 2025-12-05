/**
 * PostPublishScreen 发布内容页面
 * 支持发布经验分享、评测、教程等内容
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  TextArea,
  Card,
  useTheme,
  AlertDialog,
  Button,
} from 'tamagui';
import { Pressable, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Image as ImageIcon,
  Hash,
  Plus,
  X,
  Save,
  Send,
  Crown,
  CheckCircle,
  ChevronDown,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
import { PostCategory } from '@/types/community';
import { articleService, ArticleDraft } from '@/services/articleService';
import { usePublishLimit } from '@/hooks/useMembershipBenefit';
import { useToastController } from '@tamagui/toast';

interface PostPublishScreenProps {
  navigation: any;
}

/**
 * 发布内容页面
 */
export const PostPublishScreen: React.FC<PostPublishScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const toast = useToastController();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  // 基本信息
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>(PostCategory.EXPERIENCE);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);

  // 标签
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // 图片列表
  const [images, setImages] = useState<string[]>([]);

  // 状态
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false); // 防止重复提交
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(undefined);

  // 草稿恢复弹窗状态
  const [draftDialogOpen, setDraftDialogOpen] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<ArticleDraft | null>(null);

  // 发布次数限制 Hook - 暂时禁用
  // const {
  //   canPublish,
  //   remaining: publishRemaining,
  //   limit: publishLimit,
  //   isUnlimited: isPublishUnlimited,
  //   isLoading: isPublishLimitLoading,
  //   recordUsage: recordPublishUsage,
  // } = usePublishLimit();

  // 暂时设置为无限制
  const canPublish = true;
  const publishRemaining = 999;
  const publishLimit = 999;
  const isPublishUnlimited = true;
  const isPublishLimitLoading = false;
  const recordPublishUsage = async () => {};

  // 显示发布限制升级提示 - 暂时禁用
  const showPublishLimitAlert = useCallback(() => {
    // 暂时不限制
  }, [navigation]);

  // 内容类型选项
  const categoryOptions = [
    { label: '经验分享', value: PostCategory.EXPERIENCE, icon: '💡' },
    { label: '产品评测', value: PostCategory.REVIEW, icon: '⭐' },
    { label: '教程指南', value: PostCategory.TUTORIAL, icon: '📖' },
    { label: '问题求助', value: PostCategory.QA, icon: '❓' },
    { label: '其他', value: PostCategory.OTHER, icon: '📝' },
  ];

  // 加载草稿内容
  const loadDraft = useCallback((draft: ArticleDraft) => {
    setTitle(draft.title);
    setContent(draft.content);
    setTags(draft.tags || []);
    setCoverImage(draft.coverImage);
    setImages(draft.images || []);
    setCurrentDraftId(draft.id);
    // 根据草稿的 category 设置分类
    const categoryOption = categoryOptions.find(opt => opt.label === draft.category);
    if (categoryOption) {
      setCategory(categoryOption.value);
    }
    toast.show('草稿已加载', { message: '可以继续编辑' });
  }, [toast]);

  // 检查是否有草稿
  useEffect(() => {
    const checkDrafts = async () => {
      try {
        const drafts = await articleService.getDrafts();
        if (drafts.length > 0) {
          const latestDraft = drafts[0];
          setPendingDraft(latestDraft);
          setDraftDialogOpen(true);
        }
      } catch (error) {
        console.error('检查草稿失败:', error);
      }
    };
    checkDrafts();
  }, []);

  // 确认加载草稿
  const confirmLoadDraft = () => {
    if (pendingDraft) {
      loadDraft(pendingDraft);
    }
    setDraftDialogOpen(false);
    setPendingDraft(null);
  };

  // 取消加载草稿
  const cancelLoadDraft = () => {
    setDraftDialogOpen(false);
    setPendingDraft(null);
  };

  const getCategoryLabel = (cat: PostCategory): string => {
    return categoryOptions.find((opt) => opt.value === cat)?.label || '其他';
  };

  const getCategoryIcon = (cat: PostCategory): string => {
    return categoryOptions.find((opt) => opt.value === cat)?.icon || '📝';
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // 移除标签
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 添加图片
  const handleAddImage = () => {
    Alert.alert('提示', '图片上传功能开发中...');
  };

  // 表单验证
  const validateForm = (): boolean => {
    console.log('=== validateForm called ===');
    console.log('title:', title, 'length:', title.trim().length);
    console.log('content:', content, 'length:', content.trim().length);

    if (!title.trim()) {
      console.log('Validation failed: title empty');
      Alert.alert('提示', '请输入标题');
      return false;
    }
    if (title.trim().length > 50) {
      console.log('Validation failed: title too long');
      Alert.alert('提示', '标题不能超过50字');
      return false;
    }
    if (!content.trim()) {
      console.log('Validation failed: content empty');
      Alert.alert('提示', '请输入内容');
      return false;
    }
    if (content.trim().length < 10) {
      console.log('Validation failed: content too short');
      Alert.alert('提示', '内容至少需要10个字');
      return false;
    }
    console.log('Validation passed!');
    return true;
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    console.log('=== handleSaveDraft called ===');
    if (!title.trim() && !content.trim()) {
      toast.show('提示', { message: '标题和内容不能都为空' });
      return;
    }

    try {
      setLoading(true);
      console.log('Saving draft...');
      const draft = await articleService.saveDraft({
        title: title.trim(),
        content: content.trim(),
        category: getCategoryLabel(category),
        tags,
        coverImage,
        images: images.length > 0 ? images : undefined,
      });
      setCurrentDraftId(draft.id);
      console.log('Draft saved successfully, id:', draft.id);
      toast.show('草稿已保存', { message: '可在草稿箱中查看' });
    } catch (error) {
      console.error('保存草稿失败:', error);
      toast.show('保存失败', { message: '请稍后重试' });
    } finally {
      setLoading(false);
    }
  };

  // 发布内容
  const handlePublish = async () => {
    console.log('=== handlePublish called ===');

    // 防止重复提交
    if (submitting) {
      console.log('Already submitting, ignore');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // 等待权益检查加载完成
    if (isPublishLimitLoading) {
      toast.show('提示', { message: '正在检查发布权限，请稍后再试' });
      return;
    }

    // 检查发布次数限制
    if (!canPublish) {
      showPublishLimitAlert();
      return;
    }

    try {
      setSubmitting(true);
      setLoading(true);
      console.log('Creating article...');

      const newArticle = await articleService.createArticle({
        title: title.trim(),
        content: content.trim(),
        category: getCategoryLabel(category),
        tags,
        coverImage,
        images: images.length > 0 ? images : undefined,
      });

      console.log('Article created:', newArticle.id);

      // 记录发布次数
      await recordPublishUsage();

      // 如果有草稿，删除草稿
      if (currentDraftId) {
        await articleService.deleteDraft(currentDraftId);
      }

      // 显示成功提示
      toast.show('发布成功', { message: '您的内容已发布' });

      // 返回上一页
      navigation.goBack();
    } catch (error) {
      console.error('发布内容失败:', error);
      toast.show('发布失败', { message: '请稍后重试' });
      setSubmitting(false); // 失败时允许重新提交
    } finally {
      setLoading(false);
    }
  };

  // 渲染右侧操作按钮
  const renderRightActions = () => (
    <XStack gap="$2">
      <TouchableOpacity
        onPress={() => {
          console.log('Draft button pressed');
          handleSaveDraft();
        }}
        activeOpacity={0.7}
      >
        <View
          paddingHorizontal="$2"
          paddingVertical="$1.5"
          borderRadius="$10"
          backgroundColor="$color4"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack gap="$1" alignItems="center">
            <Save size={14} color={color10} />
            <Text fontSize="$2" color="$color10">
              草稿
            </Text>
          </XStack>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          console.log('Publish button pressed');
          handlePublish();
        }}
        disabled={loading || submitting}
        activeOpacity={0.7}
      >
        <View
          paddingHorizontal="$2.5"
          paddingVertical="$1.5"
          borderRadius="$10"
          backgroundColor={(loading || submitting) ? '$color10' : primaryColor}
        >
          <XStack gap="$1" alignItems="center">
            <Send size={14} color="white" />
            <Text fontSize="$2" color="white" fontWeight="500">
              {(loading || submitting) ? '发布中...' : '发布'}
            </Text>
          </XStack>
        </View>
      </TouchableOpacity>
    </XStack>
  );

  // 渲染内容类型选择
  const renderCategorySelector = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <Text fontSize="$3" color="$color12" marginBottom="$1.5" fontWeight="600">
        内容类型
      </Text>

      <Pressable onPress={() => setShowCategorySelector(!showCategorySelector)}>
        <View
          backgroundColor="$color4"
          padding="$2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$2" alignItems="center">
              <Text fontSize={18}>{getCategoryIcon(category)}</Text>
              <Text fontSize="$3" color="$color12">
                {getCategoryLabel(category)}
              </Text>
            </XStack>
            <ChevronDown
              size={16}
              color={color10}
              style={{ transform: [{ rotate: showCategorySelector ? '180deg' : '0deg' }] }}
            />
          </XStack>
        </View>
      </Pressable>

      {showCategorySelector && (
        <View
          backgroundColor="$color4"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$color5"
          marginTop="$1.5"
          overflow="hidden"
        >
          {categoryOptions.map((option, index) => (
            <Pressable
              key={option.value}
              onPress={() => {
                setCategory(option.value);
                setShowCategorySelector(false);
              }}
            >
              <View
                padding="$2"
                borderBottomWidth={index < categoryOptions.length - 1 ? 1 : 0}
                borderBottomColor="$color5"
                backgroundColor={category === option.value ? `${primaryColor}10` : 'transparent'}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack gap="$2" alignItems="center">
                    <Text fontSize={18}>{option.icon}</Text>
                    <Text fontSize="$3" color="$color12">
                      {option.label}
                    </Text>
                  </XStack>
                  {category === option.value && (
                    <CheckCircle size={16} color={primaryColor} />
                  )}
                </XStack>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );

  // 渲染标题输入
  const renderTitleInput = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <XStack justifyContent="space-between" alignItems="center" marginBottom="$1.5">
        <Text fontSize="$3" color="$color12" fontWeight="600">
          标题 *
        </Text>
        <Text fontSize="$2" color="$color10">
          {title.length}/50
        </Text>
      </XStack>

      <Input
        value={title}
        onChangeText={setTitle}
        placeholder="起个吸引人的标题吧"
        backgroundColor="$color4"
        borderWidth={1}
        borderColor="$color5"
        borderRadius="$4"
        paddingHorizontal="$2"
        paddingVertical="$2"
        fontSize="$3"
        maxLength={50}
      />
    </Card>
  );

  // 渲染图片上传
  const renderImageUpload = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <Text fontSize="$3" color="$color12" marginBottom="$1.5" fontWeight="600">
        图片（可选）
      </Text>

      <XStack flexWrap="wrap" gap="$1.5">
        {images.map((image, index) => (
          <View
            key={index}
            width={72}
            height={72}
            borderRadius="$4"
            backgroundColor="$color4"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Text fontSize={32}>📷</Text>
            <Pressable
              onPress={() => setImages(images.filter((_, i) => i !== index))}
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
              }}
            >
              <View
                width={18}
                height={18}
                borderRadius={9}
                backgroundColor={errorColor}
                justifyContent="center"
                alignItems="center"
              >
                <X size={10} color="white" />
              </View>
            </Pressable>
          </View>
        ))}

        {images.length < 9 && (
          <Pressable onPress={handleAddImage}>
            <View
              width={72}
              height={72}
              borderRadius="$4"
              borderWidth={2}
              borderColor="$color5"
              borderStyle="dashed"
              justifyContent="center"
              alignItems="center"
            >
              <ImageIcon size={20} color={color10} />
              <Text fontSize="$2" color="$color10" marginTop="$0.5">
                添加
              </Text>
            </View>
          </Pressable>
        )}
      </XStack>

      <Text fontSize="$2" color="$color10" marginTop="$1.5">
        最多9张，第一张作为封面
      </Text>
    </Card>
  );

  // 渲染内容输入
  const renderContentInput = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <Text fontSize="$3" color="$color12" marginBottom="$1.5" fontWeight="600">
        正文 *
      </Text>

      <TextArea
        value={content}
        onChangeText={setContent}
        placeholder="分享你的经验、心得和感受..."
        backgroundColor="$color4"
        borderWidth={1}
        borderColor="$color5"
        borderRadius="$4"
        paddingHorizontal="$2"
        paddingVertical="$2"
        fontSize="$3"
        minHeight={160}
        numberOfLines={8}
      />

      <Text fontSize="$2" color="$color10" marginTop="$1">
        至少10个字
      </Text>
    </Card>
  );

  // 渲染标签输入
  const renderTagsInput = () => (
    <Card
      marginHorizontal="$2.5"
      marginTop="$2"
      padding="$2"
      borderRadius="$5"
      backgroundColor="$color2"
      borderWidth={1}
      borderColor="$color5"
    >
      <XStack gap="$1.5" alignItems="center" marginBottom="$1.5">
        <Hash size={16} color={primaryColor} />
        <Text fontSize="$3" color="$color12" fontWeight="600">
          标签（最多5个）
        </Text>
      </XStack>

      <XStack gap="$1.5" alignItems="center" marginBottom="$2">
        <Input
          value={newTag}
          onChangeText={setNewTag}
          placeholder="添加标签"
          backgroundColor="$color4"
          borderWidth={1}
          borderColor="$color5"
          borderRadius="$4"
          paddingHorizontal="$2"
          paddingVertical="$1.5"
          fontSize="$3"
          flex={1}
        />
        <Pressable onPress={handleAddTag} disabled={tags.length >= 5}>
          <View
            backgroundColor={tags.length >= 5 ? '$color10' : primaryColor}
            width={36}
            height={36}
            borderRadius={18}
            justifyContent="center"
            alignItems="center"
          >
            <Plus size={18} color="white" />
          </View>
        </Pressable>
      </XStack>

      {tags.length > 0 && (
        <XStack flexWrap="wrap" gap="$1.5">
          {tags.map((tag, index) => (
            <View
              key={index}
              backgroundColor={`${primaryColor}15`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$10"
              borderWidth={1}
              borderColor={`${primaryColor}30`}
            >
              <XStack gap="$1" alignItems="center">
                <Text fontSize="$2" color={primaryColor}>
                  #{tag}
                </Text>
                <Pressable onPress={() => handleRemoveTag(tag)}>
                  <X size={12} color={primaryColor} />
                </Pressable>
              </XStack>
            </View>
          ))}
        </XStack>
      )}
    </Card>
  );

  // 渲染发布限制提示
  const renderPublishLimitTip = () => {
    if (isPublishUnlimited) return null;

    return (
      <View
        marginHorizontal="$2.5"
        marginTop="$2"
        padding="$2"
        borderRadius="$5"
        backgroundColor={canPublish ? `${primaryColor}10` : `${warningColor}10`}
      >
        <XStack justifyContent="center" alignItems="center" gap="$1.5">
          {canPublish ? (
            <Text fontSize="$2" color="$color10">
              本月剩余 {publishRemaining} 次发布机会
            </Text>
          ) : (
            <>
              <Crown size={14} color={warningColor} />
              <Text fontSize="$2" color={warningColor}>
                本月发布次数已用完
              </Text>
              <Pressable onPress={() => navigation.navigate('MembershipCenter' as never)}>
                <Text fontSize="$2" color={primaryColor} fontWeight="600">
                  升级会员
                </Text>
              </Pressable>
            </>
          )}
        </XStack>
      </View>
    );
  };

  // 渲染发布提示
  const renderPublishTip = () => (
    <View
      marginHorizontal="$2.5"
      marginTop="$2"
      marginBottom="$4"
      padding="$2"
      borderRadius="$5"
      backgroundColor={`${primaryColor}08`}
    >
      <Text fontSize="$2" color="$color10" textAlign="center">
        发布内容表示您同意遵守社区规范，不发布违法违规内容
      </Text>
    </View>
  );

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="发布内容"
          renderRight={renderRightActions}
        />
      </View>

      {/* 滚动内容 */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 内容类型选择 */}
        {renderCategorySelector()}

        {/* 标题输入 */}
        {renderTitleInput()}

        {/* 图片上传 */}
        {renderImageUpload()}

        {/* 内容输入 */}
        {renderContentInput()}

        {/* 标签输入 */}
        {renderTagsInput()}

        {/* 发布限制提示 */}
        {renderPublishLimitTip()}

        {/* 发布提示 */}
        {renderPublishTip()}

        {/* 底部安全区域 */}
        <View height={insets.bottom + 20} />
      </ScrollView>

      {/* 草稿恢复弹窗 */}
      <AlertDialog open={draftDialogOpen} onOpenChange={setDraftDialogOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.5}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <AlertDialog.Content
            bordered
            elevate
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            x={0}
            scale={1}
            opacity={1}
            y={0}
            backgroundColor="white"
            borderRadius="$5"
            padding="$4"
            width="85%"
            maxWidth={340}
          >
            <YStack gap="$3">
              <AlertDialog.Title fontSize="$5" fontWeight="600" color="$color12">
                发现草稿
              </AlertDialog.Title>
              <AlertDialog.Description fontSize="$3" color="$color10">
                是否加载上次编辑的草稿「{pendingDraft?.title || '无标题'}」？
              </AlertDialog.Description>

              <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
                <AlertDialog.Cancel asChild>
                  <Button
                    backgroundColor="$color4"
                    borderRadius="$10"
                    paddingHorizontal="$4"
                    onPress={cancelLoadDraft}
                  >
                    <Text color="$color12">不用了</Text>
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button
                    backgroundColor={primaryColor}
                    borderRadius="$10"
                    paddingHorizontal="$4"
                    onPress={confirmLoadDraft}
                  >
                    <Text color="white">加载草稿</Text>
                  </Button>
                </AlertDialog.Action>
              </XStack>
            </YStack>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
    </View>
  );
};
