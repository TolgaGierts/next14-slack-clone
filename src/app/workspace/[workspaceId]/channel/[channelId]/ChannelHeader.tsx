import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { TrashIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUpdateChannel } from '@/features/channels/api/useUpdateChannel';
import { useChannelId } from '@/hooks/useChannelId';
import { useRemoveChannel } from '@/features/channels/api/useRemoveChannel';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import { useRouter } from 'next/navigation';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { useCurrentMember } from '@/features/members/api/useCurrentMember';

interface ChannelHeaderProps {
  channelName: string;
}

const ConversationHeader = ({ channelName }: ChannelHeaderProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkSpaceId();
  const { data: member } = useCurrentMember({ workspaceId });

  const [editOpen, setEditOpen] = useState(false);
  const [value, setValue] = useState(channelName);
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure you want to delete this channel?',
    'You are about to delete this channel. This action is irreversable.'
  );

  const { mutate: updateChannel, isPending: isUpdatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: IsRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return;

    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value.replace(/\s/g, '-').toLowerCase();
    setValue(value);
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel deleted successfully.');
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to remove channel');
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateChannel(
      { name: value, id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel name updated.');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update channel');
        },
      }
    );
  };

  return (
    <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden'>
      <ConfirmDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={'ghost'}
            className='text-lg font-bold px-2 overflow-hidden w-auto'
            size={'sm'}
          >
            <span className='truncate'>#{channelName}</span>
            <FaChevronRight className='size-2.5 ml-2' />
          </Button>
        </DialogTrigger>
        <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
          <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>#{channelName}</DialogTitle>
          </DialogHeader>
          <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className='px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>Channel Name</p>
                    {member?.role === 'admin' && (
                      <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                        Edit
                      </p>
                    )}
                  </div>
                  <p className='text-sm'>#{channelName}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename Channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <Input
                    value={value}
                    onChange={handleChange}
                    disabled={isUpdatingChannel}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder='e.g. channel-name'
                  />
                </form>
                <DialogFooter>
                  <Button
                    variant='ghost'
                    onClick={() => setEditOpen(false)}
                    disabled={isUpdatingChannel}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setEditOpen(false)}
                    disabled={isUpdatingChannel}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                disabled={IsRemovingChannel}
                onClick={handleRemove}
                className='flex items-center gap-x-2 py-4 px-5 bg-white rounded-lg cursor-pointer border hover:bg-gray-50  text-rose-600'
              >
                <TrashIcon className='size-4' />
                <p className='text-sm font-semibold'>Delete Channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConversationHeader;
