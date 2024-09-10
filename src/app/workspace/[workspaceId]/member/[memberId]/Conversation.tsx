import React from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useMemberId } from '@/hooks/useMemberId';
import { useGetMember } from '@/features/members/api/useGetMember';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { Loader } from 'lucide-react';
import ConversationHeader from './ConversationHeader';
import ChatInput from './ChatInput';
import MessageList from '@/components/MessageList';
import { UsePanel } from '@/hooks/UsePanel';

interface ConversationProps {
  id: Id<'conversations'>;
}

const Conversation = ({ id }: ConversationProps) => {
  const { onOpenProfile } = UsePanel();
  const memberId = useMemberId();
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <ConversationHeader
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
        variant='conversation'
      />
      <ChatInput conversationId={id} placeholder='Type a message...' />
    </div>
  );
};

export default Conversation;
