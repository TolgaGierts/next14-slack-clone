import { useParentMessageId } from '@/features/messages/store/useParentMessageId';
import { useProfileMemberId } from '@/features/members/store/useProfileMemberId';

export const UsePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();

  const onOpenProfile = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onOpenMessage = (messageId: string) => {
    setParentMessageId(messageId);
    setProfileMemberId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    onClose,
    onOpenProfile,
    profileMemberId,
  };
};
