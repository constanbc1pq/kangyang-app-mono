import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  Input,
  TextArea,
  Card,
  H3,
} from 'tamagui';
import { SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import {
  ArrowLeft,
  Image as ImageIcon,
  Hash,
  Plus,
  X,
  Save,
  Send,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { CommunityPost, PostCategory } from '@/types/community';
import { createPost } from '@/services/communityDataService';

interface PostPublishScreenProps {
  navigation: any;
}

/**
 * 发布内容页面
 * 支持发布经验分享、评测、教程等内容
 */
export const PostPublishScreen: React.FC<PostPublishScreenProps> = ({
  navigation,
}) => {
  // 基本信息
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>(PostCategory.EXPERIENCE);
  const [coverImage, setCoverImage] = useState<string | undefined>(undefined);

  // 标签
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // 图片列表（TODO: 实际上传功能）
  const [images, setImages] = useState<string[]>([]);

  // 状态
  const [loading, setLoading] = useState(false);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  // 内容类型选项
  const categoryOptions = [
    { label: '经验分享', value: PostCategory.EXPERIENCE, icon: '💡' },
    { label: '产品评测', value: PostCategory.REVIEW, icon: '⭐' },
    { label: '教程指南', value: PostCategory.TUTORIAL, icon: '📖' },
    { label: '问题求助', value: PostCategory.QA, icon: '❓' },
    { label: '其他', value: PostCategory.OTHER, icon: '📝' },
  ];

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

  // 添加图片（TODO: 实际上传功能）
  const handleAddImage = () => {
    Alert.alert('提示', '图片上传功能开发中...');
    // TODO: 集成 expo-image-picker
  };

  // 表单验证
  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('提示', '请输入标题');
      return false;
    }
    if (title.trim().length > 50) {
      Alert.alert('提示', '标题不能超过50字');
      return false;
    }
    if (!content.trim()) {
      Alert.alert('提示', '请输入内容');
      return false;
    }
    if (content.trim().length < 10) {
      Alert.alert('提示', '内容至少需要10个字');
      return false;
    }
    return true;
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('提示', '标题和内容不能都为空');
      return;
    }

    Alert.alert('提示', '草稿保存功能开发中...');
    // TODO: 保存到本地草稿箱
  };

  // 发布内容
  const handlePublish = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt'> = {
        title: title.trim(),
        content: content.trim(),
        category,
        coverImage,
        images: images.length > 0 ? images : undefined,
        tags,
        authorId: 'user_current',
        authorName: '我',
        authorAvatar: '👤',
        authorVerified: false,
        views: 0,
        likes: 0,
        favorites: 0,
        comments: 0,
        shares: 0,
        publishTime: '刚刚',
      };

      const newPost = await createPost(postData);

      Alert.alert('发布成功', '您的内容已发布', [
        {
          text: '返回',
          onPress: () => navigation.goBack(),
        },
        {
          text: '查看',
          onPress: () => {
            navigation.replace('PostDetail', { postId: newPost.id });
          },
        },
      ]);
    } catch (error) {
      console.error('发布内容失败:', error);
      Alert.alert('发布失败', '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (title.trim() || content.trim()) {
      Alert.alert('提示', '您有未保存的内容，确定要退出吗？', [
        { text: '取消', style: 'cancel' },
        { text: '保存草稿', onPress: handleSaveDraft },
        { text: '直接退出', onPress: () => navigation.goBack(), style: 'destructive' },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      <View
        backgroundColor="white"
        paddingTop="$3"
        paddingHorizontal="$4"
        paddingBottom="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <TouchableOpacity onPress={handleBack}>
            <View
              width={32}
              height={32}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={COLORS.text} />
            </View>
          </TouchableOpacity>

          <Text fontSize="$5" fontWeight="600" color="$text">
            发布内容
          </Text>

          <XStack space="$2">
            <TouchableOpacity onPress={handleSaveDraft}>
              <View
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$3"
                backgroundColor="$background"
              >
                <XStack space="$1" alignItems="center">
                  <Save size={16} color={COLORS.textSecondary} />
                  <Text fontSize="$3" color="$textSecondary">
                    草稿
                  </Text>
                </XStack>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePublish} disabled={loading}>
              <View
                paddingHorizontal="$3"
                paddingVertical="$2"
                borderRadius="$3"
                backgroundColor={loading ? COLORS.textSecondary : COLORS.primary}
              >
                <XStack space="$1" alignItems="center">
                  <Send size={16} color="white" />
                  <Text fontSize="$3" color="white" fontWeight="600">
                    {loading ? '发布中...' : '发布'}
                  </Text>
                </XStack>
              </View>
            </TouchableOpacity>
          </XStack>
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <View padding="$4">
          {/* 内容类型选择 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$3" color="$text" marginBottom="$2" fontWeight="600">
              内容类型
            </Text>
            <TouchableOpacity
              onPress={() => setShowCategorySelector(!showCategorySelector)}
            >
              <View
                backgroundColor="$background"
                padding="$3"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
              >
                <XStack space="$2" alignItems="center">
                  <Text fontSize={20}>{getCategoryIcon(category)}</Text>
                  <Text flex={1} fontSize="$3" color="$text">
                    {getCategoryLabel(category)}
                  </Text>
                  <Text fontSize="$3" color="$textSecondary">
                    {showCategorySelector ? '▲' : '▼'}
                  </Text>
                </XStack>
              </View>
            </TouchableOpacity>

            {showCategorySelector && (
              <View
                backgroundColor="$background"
                borderRadius="$3"
                borderWidth={1}
                borderColor="$borderColor"
                marginTop="$2"
              >
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => {
                      setCategory(option.value);
                      setShowCategorySelector(false);
                    }}
                  >
                    <View
                      padding="$3"
                      borderBottomWidth={1}
                      borderBottomColor="$borderColor"
                    >
                      <XStack space="$3" alignItems="center">
                        <Text fontSize={20}>{option.icon}</Text>
                        <Text flex={1} fontSize="$3" color="$text">
                          {option.label}
                        </Text>
                        {category === option.value && (
                          <View
                            width={20}
                            height={20}
                            borderRadius={10}
                            backgroundColor={COLORS.primary}
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Text color="white" fontSize="$2">
                              ✓
                            </Text>
                          </View>
                        )}
                      </XStack>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </Card>

          {/* 标题输入 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$3" color="$text" marginBottom="$2" fontWeight="600">
              标题 *
            </Text>
            <Input
              value={title}
              onChangeText={setTitle}
              placeholder="起个吸引人的标题吧（限50字）"
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              paddingHorizontal="$3"
              paddingVertical="$2"
              fontSize="$4"
              maxLength={50}
            />
            <Text fontSize="$2" color="$textSecondary" marginTop="$1">
              {title.length}/50
            </Text>
          </Card>

          {/* 图片上传区 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$3" color="$text" marginBottom="$2" fontWeight="600">
              图片（可选）
            </Text>

            <XStack flexWrap="wrap" gap="$2">
              {images.map((image, index) => (
                <View
                  key={index}
                  width={80}
                  height={80}
                  borderRadius="$3"
                  backgroundColor="$background"
                  justifyContent="center"
                  alignItems="center"
                  position="relative"
                >
                  <Text fontSize={40}>📷</Text>
                  <TouchableOpacity
                    onPress={() => setImages(images.filter((_, i) => i !== index))}
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                    }}
                  >
                    <View
                      width={20}
                      height={20}
                      borderRadius={10}
                      backgroundColor={COLORS.error}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <X size={12} color="white" />
                    </View>
                  </TouchableOpacity>
                </View>
              ))}

              {images.length < 9 && (
                <TouchableOpacity onPress={handleAddImage}>
                  <View
                    width={80}
                    height={80}
                    borderRadius="$3"
                    borderWidth={2}
                    borderColor="$borderColor"
                    borderStyle="dashed"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ImageIcon size={24} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                      添加
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </XStack>

            <Text fontSize="$2" color="$textSecondary" marginTop="$2">
              最多上传9张图片，第一张将作为封面
            </Text>
          </Card>

          {/* 内容输入 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <Text fontSize="$3" color="$text" marginBottom="$2" fontWeight="600">
              正文 *
            </Text>
            <TextArea
              value={content}
              onChangeText={setContent}
              placeholder="分享你的经验、心得和感受..."
              backgroundColor="$background"
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              paddingHorizontal="$3"
              paddingVertical="$2"
              fontSize="$3"
              minHeight={200}
              numberOfLines={10}
              multiline
            />
            <Text fontSize="$2" color="$textSecondary" marginTop="$1">
              至少10个字
            </Text>
          </Card>

          {/* 标签添加 */}
          <Card
            padding="$4"
            borderRadius="$4"
            backgroundColor="$surface"
            borderWidth={1}
            borderColor="$borderColor"
            marginBottom="$3"
          >
            <XStack space="$2" alignItems="center" marginBottom="$2">
              <Hash size={16} color={COLORS.primary} />
              <Text fontSize="$3" color="$text" fontWeight="600">
                标签（最多5个）
              </Text>
            </XStack>

            <XStack space="$2" marginBottom="$3" alignItems="center">
              <Input
                value={newTag}
                onChangeText={setNewTag}
                placeholder="添加标签，如：高血压护理"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$3"
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize="$3"
                flex={1}
              />
              <TouchableOpacity
                onPress={handleAddTag}
                disabled={tags.length >= 5}
              >
                <View
                  backgroundColor={
                    tags.length >= 5 ? COLORS.textSecondary : COLORS.primary
                  }
                  padding="$2"
                  borderRadius="$3"
                >
                  <Plus size={20} color="white" />
                </View>
              </TouchableOpacity>
            </XStack>

            {tags.length > 0 && (
              <XStack flexWrap="wrap" gap="$2">
                {tags.map((tag, index) => (
                  <View
                    key={index}
                    backgroundColor={`${COLORS.primary}20`}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    borderRadius="$2"
                    borderWidth={1}
                    borderColor={COLORS.primary}
                  >
                    <XStack space="$1" alignItems="center">
                      <Text fontSize="$3" color={COLORS.primary}>
                        #{tag}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                        <X size={14} color={COLORS.primary} />
                      </TouchableOpacity>
                    </XStack>
                  </View>
                ))}
              </XStack>
            )}
          </Card>

          {/* 发布提示 */}
          <View
            backgroundColor={`${COLORS.primary}10`}
            padding="$3"
            borderRadius="$3"
            marginBottom="$4"
          >
            <Text fontSize="$2" color="$textSecondary" textAlign="center">
              发布内容表示您同意遵守社区规范，不发布违法违规内容
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
