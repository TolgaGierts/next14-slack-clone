'use client';

import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useChannelId } from '@/hooks/useChannelId';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { Loader, TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

const WorkspaceIdPage = () => {
  const workspaceId = useWorkSpaceId();

  const router = useRouter();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => {
    return channels?.[0]?._id ?? null;
  }, [channels]);

  const isAdmin = useMemo(() => {
    return member?.role === 'admin';
  }, [member?.role]);

  useEffect(() => {
    if (
      workspaceLoading ||
      channelLoading ||
      memberLoading ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    channelId,
    channelLoading,
    workspace,
    workspaceLoading,
    router,
    workspaceId,
    setOpen,
    open,
    member,
    memberLoading,
    isAdmin,
  ]);

  if (workspaceLoading || channelLoading || memberLoading) {
    return (
      <div className='h-full flex-1 items-center flex-col justify-center gap-2'>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className='h-full flex-1 items-center flex-col justify-center gap-2'>
        <TriangleAlert className='size-6 text-muted-foreground' />
        <span className='text-sm text-muted-foreground'>
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className='h-full flex items-center flex-col justify-center gap-2'>
      <TriangleAlert className='size-6 text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>No channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
