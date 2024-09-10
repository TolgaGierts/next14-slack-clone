import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateChannelModal } from '../store/useCreateChannelModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCreateChannel } from '../api/useCreateChannel';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const CreateChannelModal = () => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();

  const [open, setOpen] = useCreateChannelModal();
  const [name, setName] = useState('');

  const { mutate, isPending } = useCreateChannel();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const value = event.target.value.replace(/\s/g, '-').toLowerCase();
    setName(value);
  };

  const handleClose = () => {
    setName('');
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId },
      {
        onSuccess: (id) => {
          toast.success('Channel created successfully');
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error('Failed to create channel');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <Input
            onChange={handleChange}
            value={name}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            maxLength={80}
            placeholder='e.g. plan-budget'
          />
          <div className='flex justify-end'>
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
