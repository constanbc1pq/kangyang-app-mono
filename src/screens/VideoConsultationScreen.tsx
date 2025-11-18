/**
 * ============================================================================
 * 视频咨询页面 - VideoConsultationScreen
 * ============================================================================
 *
 * Phase 33.5: 视频咨询
 *
 * 【功能概述】
 * - 提供律师视频通话咨询服务
 * - 支持屏幕共享、录屏等高级功能
 *
 * 【主要功能】
 * 1. 视频通话界面：实时音视频通信（需对接第三方SDK如腾讯云TRTC、声网Agora）
 * 2. 屏幕共享功能：展示文档、证据材料
 * 3. 录屏功能：留存咨询记录
 * 4. 通话控制：静音、关闭摄像头、切换摄像头
 * 5. 通话时长统计：实时显示咨询时长
 *
 * 【技术说明】
 * - 本实现为UI框架，实际视频通话需对接第三方SDK：
 *   * 腾讯云TRTC: https://cloud.tencent.com/product/trtc
 *   * 声网Agora: https://www.agora.io/cn/
 *   * 网易云信: https://yunxin.163.com/
 *
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LawyerProfile } from '../types/legalService';
import { getLawyerById } from '../services/legalService';

interface Props {
  navigation: any;
  route: {
    params: {
      lawyerId: string;
      sessionId?: string; // 会话ID（预约成功后生成）
    };
  };
}

// 通话状态
type CallStatus = 'connecting' | 'connected' | 'ended';

const VideoConsultationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { lawyerId, sessionId } = route.params;

  // 状态管理
  const [lawyer, setLawyer] = useState<LawyerProfile | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('connecting');

  // 通话控制
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // 通话时长
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadLawyerInfo();
    initializeVideoCall();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      // TODO: 断开视频通话连接
    };
  }, [lawyerId]);

  const loadLawyerInfo = async () => {
    try {
      const data = await getLawyerById(lawyerId);
      if (data) {
        setLawyer(data);
      }
    } catch (error) {
      console.error('Error loading lawyer:', error);
    }
  };

  const initializeVideoCall = async () => {
    // TODO: 初始化视频通话SDK
    // 示例：腾讯云TRTC初始化流程
    // 1. 导入SDK: import TRTC from 'trtc-react-native-sdk';
    // 2. 创建实例: const trtc = TRTC.createInstance();
    // 3. 加入房间: await trtc.enterRoom({ roomId, userId, userSig });
    // 4. 开启本地视频: await trtc.startLocalVideo(true);
    // 5. 监听远端用户加入

    // 模拟连接过程
    connectionTimeoutRef.current = setTimeout(() => {
      setCallStatus('connected');
      startCallTimer();
    }, 3000);
  };

  const startCallTimer = () => {
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 跨平台确认对话框
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      }
    } else {
      Alert.alert(title, message, [
        { text: '取消', style: 'cancel' },
        { text: '确定', style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  // 切换静音
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // TODO: 调用SDK静音方法
    // trtc.muteLocalAudio(!isMuted);
  };

  // 切换视频
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // TODO: 调用SDK视频控制方法
    // trtc.muteLocalVideo(!isVideoEnabled);
  };

  // 切换摄像头
  const switchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
    // TODO: 调用SDK切换摄像头方法
    // trtc.switchCamera();
  };

  // 切换屏幕共享
  const toggleScreenShare = () => {
    if (!isScreenSharing) {
      showConfirm('开启屏幕共享', '将分享您的屏幕内容给律师', () => {
        setIsScreenSharing(true);
        // TODO: 调用SDK屏幕共享方法
        // trtc.startScreenCapture();
      });
    } else {
      setIsScreenSharing(false);
      // TODO: 停止屏幕共享
      // trtc.stopScreenCapture();
    }
  };

  // 切换录屏
  const toggleRecording = () => {
    if (!isRecording) {
      showConfirm('开始录制', '本次咨询将被录制，录制内容仅用于法律咨询记录', () => {
        setIsRecording(true);
        // TODO: 调用SDK录制方法
        // trtc.startLocalRecording({
        //   filePath: 'consultation_record.mp4',
        //   recordType: TRTC.TRTCRecordTypeVideo,
        // });
      });
    } else {
      setIsRecording(false);
      // TODO: 停止录制
      // trtc.stopLocalRecording();
      if (Platform.OS === 'web') {
        alert('录制已保存\n\n录制文件已保存到咨询记录中');
      } else {
        Alert.alert('录制已保存', '录制文件已保存到咨询记录中');
      }
    }
  };

  // 结束通话
  const endCall = () => {
    showConfirm('结束通话', '确定要结束本次视频咨询吗？', () => {
      // 清除所有timers
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }

      // TODO: 退出房间
      // trtc.exitRoom();

      // 直接返回上一页
      navigation.goBack();
    });
  };

  // 渲染连接中界面
  const renderConnecting = () => {
    return (
      <View style={styles.connectingContainer}>
        {/* 顶部返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            showConfirm('取消连接', '确定要取消本次视频咨询吗？', () => {
              // 清除连接timeout
              if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
              }
              // 清除计时器
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              navigation.goBack();
            });
          }}
        >
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={60} color="#999" />
          </View>
          <Text style={styles.lawyerNameText}>{lawyer?.name}</Text>
          <Text style={styles.connectingText}>正在连接...</Text>
        </View>
        <ActivityIndicator size="large" color="#fff" style={styles.loadingIndicator} />

        {/* 底部取消按钮 */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            showConfirm('取消连接', '确定要取消本次视频咨询吗？', () => {
              // 清除连接timeout
              if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
              }
              // 清除计时器
              if (timerRef.current) {
                clearInterval(timerRef.current);
              }
              navigation.goBack();
            });
          }}
        >
          <Text style={styles.cancelButtonText}>取消连接</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染视频界面
  const renderVideoCall = () => {
    return (
      <View style={styles.videoContainer}>
        {/* 远端视频（律师）- 全屏 */}
        <View style={styles.remoteVideo}>
          {/* TODO: 替换为实际的远端视频视图 */}
          {/* <TRTCVideoView userId={lawyerId} style={styles.remoteVideoView} /> */}

          {/* 模拟视频占位 */}
          <View style={styles.videoPlaceholder}>
            <Ionicons name="person" size={80} color="#fff" />
            <Text style={styles.videoPlaceholderText}>{lawyer?.name}</Text>
          </View>

          {/* 顶部信息栏 */}
          <View style={styles.topBar}>
            <View style={styles.callInfo}>
              <View style={styles.onlineIndicator} />
              <Text style={styles.callStatusText}>通话中</Text>
            </View>
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
            {/* 挂断按钮 */}
            <TouchableOpacity
              style={styles.topEndCallButton}
              onPress={endCall}
            >
              <Ionicons name="close-circle" size={32} color="#ff4d4f" />
            </TouchableOpacity>
          </View>

          {/* 录制指示器 */}
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>录制中</Text>
            </View>
          )}
        </View>

        {/* 本地视频（用户）- 小窗 */}
        <View style={styles.localVideo}>
          {/* TODO: 替换为实际的本地视频视图 */}
          {/* <TRTCVideoView userId="me" style={styles.localVideoView} /> */}

          {isVideoEnabled ? (
            <View style={styles.localVideoPlaceholder}>
              <Ionicons name="person" size={40} color="#fff" />
            </View>
          ) : (
            <View style={styles.localVideoDisabled}>
              <Ionicons name="videocam-off" size={30} color="#fff" />
            </View>
          )}

          <TouchableOpacity
            style={styles.switchCameraButton}
            onPress={switchCamera}
          >
            <Ionicons name="camera-reverse" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 底部控制栏 */}
        <View style={styles.controlBar}>
          {/* 静音按钮 */}
          <TouchableOpacity
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Ionicons
              name={isMuted ? 'mic-off' : 'mic'}
              size={24}
              color="#fff"
            />
            <Text style={styles.controlButtonText}>
              {isMuted ? '已静音' : '静音'}
            </Text>
          </TouchableOpacity>

          {/* 视频按钮 */}
          <TouchableOpacity
            style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
            onPress={toggleVideo}
          >
            <Ionicons
              name={isVideoEnabled ? 'videocam' : 'videocam-off'}
              size={24}
              color="#fff"
            />
            <Text style={styles.controlButtonText}>
              {isVideoEnabled ? '视频' : '已关闭'}
            </Text>
          </TouchableOpacity>

          {/* 屏幕共享按钮 */}
          <TouchableOpacity
            style={[styles.controlButton, isScreenSharing && styles.controlButtonActive]}
            onPress={toggleScreenShare}
          >
            <Ionicons
              name={isScreenSharing ? 'desktop' : 'desktop-outline'}
              size={24}
              color="#fff"
            />
            <Text style={styles.controlButtonText}>
              {isScreenSharing ? '共享中' : '共享'}
            </Text>
          </TouchableOpacity>

          {/* 录制按钮 */}
          <TouchableOpacity
            style={[styles.controlButton, isRecording && styles.controlButtonActive]}
            onPress={toggleRecording}
          >
            <Ionicons
              name={isRecording ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={isRecording ? '#ff4d4f' : '#fff'}
            />
            <Text style={styles.controlButtonText}>
              {isRecording ? '录制中' : '录制'}
            </Text>
          </TouchableOpacity>

          {/* 挂断按钮 */}
          <TouchableOpacity
            style={styles.endCallButton}
            onPress={endCall}
          >
            <Ionicons name="call" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {callStatus === 'connecting' && renderConnecting()}
      {callStatus === 'connected' && renderVideoCall()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  cancelButton: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,77,79,0.9)',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 28,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  lawyerNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  connectingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  loadingIndicator: {
    marginTop: 40,
  },
  videoContainer: {
    flex: 1,
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
  },
  videoPlaceholderText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 16,
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  topEndCallButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#52c41a',
    marginRight: 6,
  },
  callStatusText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 80,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,77,79,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  recordingText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  localVideo: {
    position: 'absolute',
    top: 120,
    right: 16,
    width: 100,
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  localVideoPlaceholder: {
    flex: 1,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  localVideoDisabled: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchCameraButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlBar: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    minWidth: 60,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(24,144,255,0.8)',
  },
  controlButtonText: {
    fontSize: 11,
    color: '#fff',
    marginTop: 4,
  },
  endCallButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ff4d4f',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
});

export default VideoConsultationScreen;
