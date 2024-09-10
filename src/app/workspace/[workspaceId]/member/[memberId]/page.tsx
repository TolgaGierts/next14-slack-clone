'use client';

import { useCreateorGetConversation } from '@/features/conversations/api/useCreateorGetConversation';
import { useMemberId } from '@/hooks/useMemberId';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { AlertTriangleIcon, Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import Conversation from './Conversation';

const MemberIdPage = () => {
  const workspaceId = useWorkSpaceId();
  const memberId = useMemberId();

  const [conversationId, setConversationId] =
    useState<Id<'conversations'> | null>(null);

  const { mutate, isPending } = useCreateorGetConversation();

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess: (data) => {
          setConversationId(data);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }, [mutate, memberId, workspaceId]);

  if (isPending) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }
  if (!conversationId) {
    return (
      <div className='h-full flex flex-col gap-y-2 items-center justify-center'>
        <AlertTriangleIcon className='size-6 text-muted-foreground' />
        <span className='text-xs text-muted-foreground'>
          Conversation not found.
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
};

export default MemberIdPage;
