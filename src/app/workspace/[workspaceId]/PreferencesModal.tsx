import React, { use } from 'react';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { TrashIcon } from 'lucide-react';
import { useUpdateWorkspace } from '@/features/workspaces/api/useUpdateWorkspace';
import { useRemoveWorkspace } from '@/features/workspaces/api/useRemoveWorkspace';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useConfirm } from '@/hooks/useConfirm';

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

const PreferencesModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const workspaceId = useWorkSpaceId();
  const router = useRouter();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete Workspace',
    'Are you sure you want to delete this workspace?'
  );

  const [value, setValue] = React.useState(initialValue);
  const [editOpen, setEditOpen] = React.useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success('Workspace updated successfully');
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      {
        id: workspaceId,
      },
      {
        onSuccess: () => {
          setOpen(false);
          router.replace('/');
          toast.success('Workspace deleted successfully');
        },
        onError: () => {
          toast.error('Failed to update workspace');
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='p-0 bg-gray-50 overflow-hidden'>
          <DialogHeader className='p-4 border-b bg-white'>
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className='px-4 pb-4 flex flex-col gap-y-2'>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className='px-5 py-4 bg-white rounded-lg cursor-pointer hover:bg-gray-50'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-semibold'>Workspace name</p>
                    <p className='text-sm text-[#1264a3] hover:underline font-semibold'>
                      Edit
                    </p>
                  </div>
                  <p className='text-sm'>{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className='space-y-4' onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    onChange={(e) => {
                      setValue(e.target.value);
                    }}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={'outline'}>Cancel</Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className='flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'
            >
              <TrashIcon className='size-4' />
              <p className='text-sm font-semibold'>Delete Workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferencesModal;
