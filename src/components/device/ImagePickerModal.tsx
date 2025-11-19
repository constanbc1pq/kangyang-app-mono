/**
 * 图片选择Modal组件
 * 区分web和移动端：
 * - 移动端：显示拍照和相册选择
 * - web端：只显示上传图片
 */

import React from 'react';
import { View, Text, YStack, XStack } from 'tamagui';
import { Modal, Pressable, Platform, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';
import { COLORS } from '@/constants/app';

interface ImagePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  visible,
  onClose,
  onImageSelected,
}) => {
  const isWeb = Platform.OS === 'web';

  /**
   * 请求相机权限
   */
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '需要相机权限',
          '请在设置中开启相机权限以使用拍照功能',
          [{ text: '确定' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('请求相机权限失败:', error);
      return false;
    }
  };

  /**
   * 请求相册权限
   */
  const requestGalleryPermission = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '需要相册权限',
          '请在设置中开启相册权限以选择照片',
          [{ text: '确定' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error('请求相册权限失败:', error);
      return false;
    }
  };

  /**
   * 拍照
   */
  const handleTakePhoto = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.back, // 强制使用后置摄像头
        exif: true, // 保留 EXIF 方向信息
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onClose();
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('拍照失败:', error);
      Alert.alert('拍照失败', '请重试');
    }
  };

  /**
   * 从相册选择
   */
  const handlePickFromGallery = async () => {
    try {
      const hasPermission = await requestGalleryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        exif: true, // 保留 EXIF 方向信息
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onClose();
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('选择照片失败:', error);
      Alert.alert('选择失败', '请重试');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          <YStack space="$3">
            {/* 标题 */}
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize="$6" fontWeight="600" color="$text">
                {isWeb ? '上传图片' : '选择图片来源'}
              </Text>
              <Pressable onPress={onClose}>
                <View
                  width={32}
                  height={32}
                  borderRadius={16}
                  backgroundColor="$borderColor"
                  justifyContent="center"
                  alignItems="center"
                >
                  <X size={20} color={COLORS.textSecondary} />
                </View>
              </Pressable>
            </XStack>

            {/* Web端：只显示上传选项 */}
            {isWeb ? (
              <Pressable onPress={handlePickFromGallery}>
                <XStack
                  space="$3"
                  alignItems="center"
                  padding="$4"
                  borderRadius="$3"
                  backgroundColor="$surface"
                  borderWidth={1}
                  borderColor="$borderColor"
                >
                  <View
                    width={48}
                    height={48}
                    borderRadius={24}
                    backgroundColor={COLORS.primary}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <ImageIcon size={24} color="white" />
                  </View>
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      上传图片
                    </Text>
                    <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                      选择设备显示屏照片
                    </Text>
                  </YStack>
                </XStack>
              </Pressable>
            ) : (
              <>
                {/* 移动端：拍照选项 */}
                <Pressable onPress={handleTakePhoto} style={{ marginBottom: 12 }}>
                  <XStack
                    space="$3"
                    alignItems="center"
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={COLORS.primary}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Camera size={24} color="white" />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        拍照上传
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                        对准设备屏幕数值拍摄
                      </Text>
                    </YStack>
                  </XStack>
                </Pressable>

                {/* 移动端：相册选项 */}
                <Pressable onPress={handlePickFromGallery}>
                  <XStack
                    space="$3"
                    alignItems="center"
                    padding="$4"
                    borderRadius="$3"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    <View
                      width={48}
                      height={48}
                      borderRadius={24}
                      backgroundColor={COLORS.warning}
                      justifyContent="center"
                      alignItems="center"
                    >
                      <ImageIcon size={24} color="white" />
                    </View>
                    <YStack flex={1}>
                      <Text fontSize="$4" fontWeight="600" color="$text">
                        从相册选择
                      </Text>
                      <Text fontSize="$2" color="$textSecondary" marginTop="$1">
                        选择已有的设备照片
                      </Text>
                    </YStack>
                  </XStack>
                </Pressable>
              </>
            )}

            {/* 温馨提示 */}
            <View
              backgroundColor="$background"
              padding="$3"
              borderRadius="$3"
              marginTop="$2"
            >
              <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                💡 拍摄提示：
              </Text>
              <Text fontSize="$2" color="$textSecondary" lineHeight={18} marginTop="$1">
                • 对准设备显示屏，确保数字清晰
              </Text>
              <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                • 保持光线充足，避免反光和模糊
              </Text>
              <Text fontSize="$2" color="$textSecondary" lineHeight={18}>
                • 尽量让数字占据画面中央位置
              </Text>
            </View>

            {/* 取消按钮 */}
            <Pressable onPress={onClose}>
              <View
                marginTop="$2"
                padding="$3"
                borderRadius="$3"
                backgroundColor="$borderColor"
                alignItems="center"
              >
                <Text fontSize="$4" fontWeight="600" color="$textSecondary">
                  取消
                </Text>
              </View>
            </Pressable>
          </YStack>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
});
