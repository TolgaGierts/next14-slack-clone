'use client';

import { Button } from '@/components/ui/button';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { InfoIcon, Search } from 'lucide-react';
import React from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { useGetChannels } from '@/features/channels/api/useGetChannels';
import { useGetMembers } from '@/features/members/api/useGetMembers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Toolbar = () => {
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  const { data } = useGetWorkspace({ id: workspaceId });
  const { data: channels } = useGetChannels({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const [open, setOpen] = React.useState(false);

  const onChannelClick = (id: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/channel/${id}`);
  };

  const onMemberClick = (id: string) => {
    setOpen(false);
    router.push(`/workspace/${workspaceId}/member/${id}`);
  };

  return (
    <nav className='bg-[#481349] flex items-center justify-between h-10 p-1.5'>
      <div className='flex-1' />
      <div className='min-w-[280px] max-[642px] grow-[2] shrink'>
        <Button
          onClick={() => setOpen(true)}
          size={'sm'}
          className='bg-accent/25 hover:bg-accent/25 w-full justify-start h-7 px-2'
        >
          <Search size={16} className='mr-2 text-white' />
          <span className='text-white text-xs'>Search {data?.name}</span>
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder='Type a command or search...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading='Channels'>
              {channels &&
                channels.map((channel) => (
                  <CommandItem
                    key={channel._id}
                    onSelect={() => onChannelClick(channel._id)}
                  >
                    <span>{channel.name}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading='Members'>
              {members &&
                members.map((member) => (
                  <CommandItem
                    key={member._id}
                    onSelect={() => onMemberClick(member._id)}
                  >
                    <span>{member.user.name}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
      <div className='ml-auto flex-1 flex items-center justify-end'>
        <Button variant={'transparent'} size={'iconSm'}>
          <InfoIcon size={20} className='text-white' />
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;
