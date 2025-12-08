import React, { useState, useEffect } from 'react';
import { YStack, XStack, Text, View, ScrollView, Input } from 'tamagui';
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Send,
  CheckCircle,
  Eye,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { TitleBar } from '@/components/TitleBar';
import { CommunityPost, PostCategory } from '@/types/community';
import { getPostById, likePost, favoritePost, commentPost } from '@/services/communityDataService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PostDetailScreenProps {
  navigation: any;
  route: {
    params: {
      postId: string;
    };
  };
}

// 模拟评论数据接口
interface Comment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
}

/**
 * 内容帖子详情页
 * 展示帖子完整内容、作者信息、评论等
 */
export const PostDetailScreen: React.FC<PostDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { postId } = route.params;
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    loadPostDetail();
    loadComments();
  }, [postId]);

  const loadPostDetail = async () => {
    try {
      setLoading(true);
      const postData = await getPostById(postId);
      if (postData) {
        setPost(postData);
      }
    } catch (error) {
      console.error('加载帖子详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = () => {
    // 模拟评论数据
    const mockComments: Comment[] = [
      {
        id: 'comment_001',
        authorName: '李阿姨',
        authorAvatar: '👵',
        content: '写得太好了！非常实用，学到了很多。',
        likes: 12,
        createdAt: '2小时前',
      },
      {
        id: 'comment_002',
        authorName: '王大爷',
        authorAvatar: '👴',
        content: '感谢分享，我爸爸也有高血压，这些建议很有帮助。',
        likes: 8,
        createdAt: '5小时前',
      },
      {
        id: 'comment_003',
        authorName: '张护士',
        authorAvatar: '👩‍⚕️',
        content: '作为护理人员，这些知识点都很准确，赞一个！',
        likes: 15,
        createdAt: '1天前',
      },
    ];
    setComments(mockComments);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    console.log('分享帖子:', postId);
  };

  const handleLike = async () => {
    if (!post) return;
    setIsLiked(!isLiked);
    await likePost(postId, 'user_current');
    // 更新点赞数
    setPost({
      ...post,
      likes: isLiked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleFavorite = async () => {
    if (!post) return;
    setIsFavorited(!isFavorited);
    await favoritePost(postId, 'user_current');
    // 更新收藏数
    setPost({
      ...post,
      favorites: isFavorited ? post.favorites - 1 : post.favorites + 1,
    });
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !post) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      authorName: '我',
      authorAvatar: '👤',
      content: commentText,
      likes: 0,
      createdAt: '刚刚',
    };

    setComments([newComment, ...comments]);
    setCommentText('');

    // 调用API
    await commentPost(postId, {
      content: commentText,
      authorId: 'user_current',
    });

    // 更新评论数
    setPost({
      ...post,
      comments: post.comments + 1,
    });
  };

  const handleFollowAuthor = () => {
    console.log('关注作者');
  };

  const getCategoryLabel = (category: PostCategory): string => {
    const labels: { [key in PostCategory]: string } = {
      [PostCategory.EXPERIENCE]: '经验分享',
      [PostCategory.REVIEW]: '产品评测',
      [PostCategory.TUTORIAL]: '使用教程',
      [PostCategory.QA]: '问答',
      [PostCategory.NEWS]: '资讯',
    };
    return labels[category];
  };

  if (loading || !post) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <TitleBar
        title="详情"
        onBack={handleBack}
        rightElement={
          <TouchableOpacity onPress={handleShare}>
            <View
              width={32}
              height={32}
              justifyContent="center"
              alignItems="center"
            >
              <Share2 size={20} color={COLORS.text} />
            </View>
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          {/* 作者信息卡片 */}
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <XStack space="$3" alignItems="center" marginBottom="$3">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$background"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={32}>{post.authorAvatar || '👤'}</Text>
              </View>

              <YStack flex={1}>
                <XStack space="$2" alignItems="center" marginBottom="$1">
                  <Text fontSize="$4" fontWeight="600" color="$text">
                    {post.authorName}
                  </Text>
                  {post.authorVerified && (
                    <View
                      width={16}
                      height={16}
                      borderRadius={8}
                      backgroundColor={COLORS.primary}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <CheckCircle size={10} color="white" />
                    </View>
                  )}
                </XStack>
                <Text fontSize="$3" color="$textSecondary">
                  {post.publishTime}
                </Text>
              </YStack>

              <TouchableOpacity onPress={handleFollowAuthor}>
                <View
                  backgroundColor={COLORS.primary}
                  paddingHorizontal="$4"
                  paddingVertical="$2"
                  borderRadius="$3"
                >
                  <Text fontSize="$3" color="white" fontWeight="600">
                    关注
                  </Text>
                </View>
              </TouchableOpacity>
            </XStack>

            {/* 浏览量和分类 */}
            <XStack space="$3" alignItems="center">
              <XStack space="$1" alignItems="center">
                <Eye size={14} color={COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  {post.views} 次浏览
                </Text>
              </XStack>
              <View
                backgroundColor={`${COLORS.primary}20`}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color={COLORS.primary}>
                  {getCategoryLabel(post.category)}
                </Text>
              </View>
            </XStack>
          </View>

          {/* 帖子内容 */}
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            {/* 标题 */}
            <Text fontSize="$6" fontWeight="700" color="$text" marginBottom="$3">
              {post.title}
            </Text>

            {/* 封面图 */}
            {post.coverImage && (
              <View
                width="100%"
                aspectRatio={16 / 9}
                borderRadius="$3"
                overflow="hidden"
                marginBottom="$3"
                backgroundColor="$background"
              >
                <Image
                  source={{ uri: post.coverImage }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            )}

            {/* 正文内容 */}
            <Text fontSize="$4" color="$text" lineHeight={26} marginBottom="$3">
              {post.content}
            </Text>

            {/* 图片列表 */}
            {post.images && post.images.length > 0 && (
              <YStack space="$2" marginBottom="$3">
                {post.images.map((image, index) => (
                  <View
                    key={index}
                    width="100%"
                    aspectRatio={4 / 3}
                    borderRadius="$3"
                    overflow="hidden"
                    backgroundColor="$background"
                  >
                    <Image
                      source={{ uri: image }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </YStack>
            )}

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <XStack flexWrap="wrap" gap="$2" marginTop="$3">
                {post.tags.map((tag, index) => (
                  <TouchableOpacity key={index}>
                    <View
                      backgroundColor="$background"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                    >
                      <Text fontSize="$3" color={COLORS.primary}>
                        #{tag}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </XStack>
            )}
          </View>

          {/* 互动数据 */}
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <XStack justifyContent="space-around">
              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
                  {post.likes}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  点赞
                </Text>
              </YStack>

              <View width={1} backgroundColor="$borderColor" />

              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
                  {post.favorites}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  收藏
                </Text>
              </YStack>

              <View width={1} backgroundColor="$borderColor" />

              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
                  {post.comments}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  评论
                </Text>
              </YStack>

              <View width={1} backgroundColor="$borderColor" />

              <YStack alignItems="center">
                <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$1">
                  {post.shares}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  分享
                </Text>
              </YStack>
            </XStack>
          </View>

          {/* 评论区 */}
          <View backgroundColor="white" padding="$4" marginBottom="$2">
            <Text fontSize="$5" fontWeight="600" color="$text" marginBottom="$3">
              评论 ({comments.length})
            </Text>

            {comments.length === 0 ? (
              <YStack alignItems="center" paddingVertical="$6">
                <MessageCircle size={48} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$textSecondary" marginTop="$3">
                  暂无评论，快来抢沙发~
                </Text>
              </YStack>
            ) : (
              <YStack space="$4">
                {comments.map((comment) => (
                  <XStack key={comment.id} space="$3" alignItems="flex-start">
                    <View
                      width={36}
                      height={36}
                      borderRadius={18}
                      backgroundColor="$background"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text fontSize={24}>{comment.authorAvatar || '👤'}</Text>
                    </View>

                    <YStack flex={1}>
                      <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                        <Text fontSize="$3" fontWeight="600" color="$text">
                          {comment.authorName}
                        </Text>
                        <Text fontSize="$2" color="$textSecondary">
                          {comment.createdAt}
                        </Text>
                      </XStack>

                      <Text fontSize="$3" color="$text" marginBottom="$2" lineHeight={20}>
                        {comment.content}
                      </Text>

                      <XStack space="$1" alignItems="center">
                        <Heart size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$2" color="$textSecondary">
                          {comment.likes}
                        </Text>
                      </XStack>
                    </YStack>
                  </XStack>
                ))}
              </YStack>
            )}
          </View>

          {/* 底部安全区域 */}
          <View height={120} />
        </ScrollView>

        {/* 底部评论输入框和操作栏 */}
        <View
          backgroundColor="white"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          paddingHorizontal="$4"
          paddingVertical="$3"
          shadowColor="$shadow"
          shadowOffset={{ width: 0, height: -2 }}
          shadowOpacity={0.1}
          shadowRadius={8}
          elevation={8}
        >
          {/* 评论输入框 */}
          <XStack space="$2" alignItems="center" marginBottom="$3">
            <View
              flex={1}
              backgroundColor="$background"
              borderRadius="$6"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <Input
                placeholder="说点什么..."
                value={commentText}
                onChangeText={setCommentText}
                fontSize="$3"
                borderWidth={0}
                backgroundColor="transparent"
                paddingHorizontal={0}
                paddingVertical={0}
              />
            </View>

            <TouchableOpacity onPress={handleSendComment} disabled={!commentText.trim()}>
              <View
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor={commentText.trim() ? COLORS.primary : '$background'}
                justifyContent="center"
                alignItems="center"
              >
                <Send
                  size={18}
                  color={commentText.trim() ? 'white' : COLORS.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </XStack>

          {/* 操作按钮 */}
          <XStack justifyContent="space-around" alignItems="center">
            <TouchableOpacity onPress={handleLike}>
              <XStack space="$2" alignItems="center">
                <Heart
                  size={22}
                  color={isLiked ? COLORS.error : COLORS.textSecondary}
                  fill={isLiked ? COLORS.error : 'none'}
                />
                <Text
                  fontSize="$3"
                  color={isLiked ? COLORS.error : '$textSecondary'}
                >
                  {isLiked ? '已赞' : '点赞'}
                </Text>
              </XStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleFavorite}>
              <XStack space="$2" alignItems="center">
                <Bookmark
                  size={22}
                  color={isFavorited ? COLORS.warning : COLORS.textSecondary}
                  fill={isFavorited ? COLORS.warning : 'none'}
                />
                <Text
                  fontSize="$3"
                  color={isFavorited ? COLORS.warning : '$textSecondary'}
                >
                  {isFavorited ? '已收藏' : '收藏'}
                </Text>
              </XStack>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare}>
              <XStack space="$2" alignItems="center">
                <Share2 size={22} color={COLORS.textSecondary} />
                <Text fontSize="$3" color="$textSecondary">
                  分享
                </Text>
              </XStack>
            </TouchableOpacity>
          </XStack>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
