import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateWorkspaceModal } from '../store/useCreateWorkspaceModal';
import { useCreateWorkSpace } from '../api/useCreateWorkspace';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const CreateWorkspaceModal = () => {
  const router = useRouter();

  const [open, setOpen] = useCreateWorkspaceModal();
  const [name, setName] = useState('');

  const { mutate, isPending, isError, isSuccess, data, error } =
    useCreateWorkSpace();

  const handleClose = () => {
    setOpen(false);
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        name,
      },
      {
        onSuccess(id) {
          router.push(`/workspace/${id}`);
          handleClose();
          toast.success('Workspace created successfully');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Create Workspace</DialogTitle>
          </DialogHeader>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
            minLength={3}
            placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};


// http://localhost:3000/join/k174ntwnw87fzvhrh5xv3czm417013yt

// qzwjds