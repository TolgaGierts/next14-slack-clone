import { useCurrentMember } from '@/features/members/api/useCurrentMember';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
  User,
} from 'lucide-react';
import React from 'react';
import WorkspaceHeader from './WorkspaceHeader';
import { SidebarItem } from './SidebarItem';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { WorkspaceSection } from './WorkspaceSection';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import UserItem from './UserItem';
import { useCreateChannelModal } from '@/features/channels/store/useCreateChannelModal';
import { useChannelId } from '@/hooks/useChannelId';
import { useMemberId } from '@/hooks/useMemberId';

const WorkspaceSidebar = () => {
  const memberId = useMemberId();

  const workspaceId = useWorkSpaceId();

  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  if (memberLoading || workspaceLoading) {
    return (
      <div className='flex flex-col bg-[#5e2c5f] h-full items-center justify-center'>
        <Loader className='size-5 animate-spin text-white' />
      </div>
    );
  }
  if (!workspace || !member) {
    return (
      <div className='flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center'>
        <AlertTriangle className='size-5 text-white' />
        <p className='text-white text-sm'>Workspace not found</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col bg-[#5e2c5f] h-full justify-start'>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />
      <div className='flex flex-col px-2 mt-3'>
        <SidebarItem label='Threads' icon={MessageSquareText} id='threads' />
        <SidebarItem label='Drafts & Sent' icon={SendHorizontal} id='drafts' />
      </div>
      <WorkspaceSection
        label={'Channels'}
        hint={'New Channel'}
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((channel) => (
          <SidebarItem
            key={channel._id}
            label={channel.name}
            icon={HashIcon}
            id={channel._id}
            variant={channel._id === channelId ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
      <WorkspaceSection label={'Direct Messages'} hint={'New direct message'}>
        {members?.map((member) => (
          <UserItem
            key={member._id}
            image={member.user.image}
            id={member._id}
            label={
              member.role === 'admin'
                ? member.user.name + ' (Admin)'
                : member.user.name
            }
            variant={member._id === memberId ? 'active' : 'default'}
          />
        ))}
      </WorkspaceSection>
    </div>
  );
};

export default WorkspaceSidebar;
