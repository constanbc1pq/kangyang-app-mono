/**
 * 聊天组件导出
 */
export { ChatPage } from './ChatPage';
export { ChatTitleBar } from './ChatTitleBar';
export { ChatInputBar } from './ChatInputBar';
export { ChatMessageList, insertTimeSeparators } from './ChatMessageList';
export { ChatMessageBubble } from './ChatMessageBubble';
export { RecipientInfoCard } from './RecipientInfoCard';
export { ChatAttachmentMenu } from './ChatAttachmentMenu';
export { ChatQuickTemplates } from './ChatQuickTemplates';
export { ChatRatingModal } from './ChatRatingModal';

// 导出类型
export type {
  ChatPageConfig,
  ChatMessage,
  RecipientConfig,
  AttachmentItem,
  Badge,
  BasicConfig,
  TitleBarConfig,
  MessageConfig,
  AttachmentConfig,
  CallConfig,
  WorkflowConfig,
  QuickTemplate,
  WelcomeMessage,
} from '@/types/chat';

export {
  ChatType,
  MessageType,
  QuoteStatus,
} from '@/types/chat';
