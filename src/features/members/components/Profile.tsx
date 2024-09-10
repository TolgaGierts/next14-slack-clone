import React, { use } from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMember } from '../api/useGetMember';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ChevronRight,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useUpdateMember } from '../api/useUpdateMember';
import { useRemoveMember } from '../api/useRemoveMember';
import { useCurrentMember } from '../api/useCurrentMember';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/useConfirm';
import { useRouter } from 'next/navigation';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();

  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const [LeaveDialog, confirmLeave] = useConfirm(
    'Leave workspace',
    'Are you sure you want to leave this workspace?'
  );

  const [RemoveDialog, confirmRemove] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member?'
  );
  const [UpdateDialog, confirmUpdate] = useConfirm(
    'Update member role',
    'Are you sure you want to update this member role?'
  );

  const workspaceId = useWorkSpaceId();

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });

  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isRemovingMember } =
    useRemoveMember();

  const onRemove = () => {
    const ok = confirmRemove();

    if (!ok) return;

    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('Member removed successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to remove member');
        },
      }
    );
  };

  const onLeave = () => {
    const ok = confirmLeave();

    if (!ok) return;
    removeMember(
      { id: memberId },
      {
        onSuccess: () => {
          toast.success('You have left the workspace');
          onClose();
          router.replace('/');
        },
        onError: () => {
          toast.error('Failed to leave workspace');
        },
      }
    );
  };
  const onUpdate = (role: 'admin' | 'member') => {
    const ok = confirmUpdate();

    if (!ok) return;
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast.success('Role changed successfully');
          onClose();
        },
        onError: () => {
          toast.error('Failed to change role');
        },
      }
    );
  };

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() || 'M';

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center px-4 h-[49px] border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 h-full items-center justify-center'>
          <Loader className='size-5 animate-spin text-muted-foreground' />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center px-4 h-[49px] border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex flex-col gap-y-2 h-full items-center justify-center'>
          <AlertTriangle className='size-5 text-muted-foreground' />
          <p className='text-sm text-muted-foreground'>Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <LeaveDialog />
      <RemoveDialog />
      <UpdateDialog />
      <div className='h-full flex flex-col'>
        <div className='flex justify-between items-center px-4 h-[49px] border-b'>
          <p className='text-lg font-bold'>Profile</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className='size-5 stroke-[1.5]' />
          </Button>
        </div>
        <div className='flex flex-col items-center justify-center p-4'>
          <Avatar className='max-w-[128px] max-h-[128px] size-full'>
            <AvatarImage src={member.user.image} />
            <AvatarFallback className='aspect-square text-4xl'>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col p-4'>
          <p className='text-xl font-bold'>{member.user.name}</p>
          {currentMember?.role === 'admin' &&
            (currentMember._id !== memberId ? (
              <div className='flex items-center gap-2 mt-4'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'outline'} className='w-full capitalize'>
                      {member.role}
                      <ChevronRight className='size-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className='w-full'>
                    <DropdownMenuRadioGroup
                      defaultValue={member.role}
                      onValueChange={(role) =>
                        onUpdate(role as 'admin' | 'member')
                      }
                    >
                      <DropdownMenuRadioItem value='admin'>
                        Admin
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value='member'>
                        Member
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={onRemove}
                  variant={'outline'}
                  className='w-full'
                >
                  Remove
                  <ChevronRight className='size-4' />
                </Button>
              </div>
            ) : currentMember._id === memberId &&
              currentMember.role !== 'admin' ? (
              <div className='mt-4'>
                <Button
                  onClick={onLeave}
                  variant={'outline'}
                  className='w-full'
                >
                  Leave
                </Button>
              </div>
            ) : null)}
        </div>
        <Separator />
        <div className='flex flex-col p-4'>
          <p className='text-sm font-bold mb-4'>Contact information</p>
          <div className='flex items-center gap-2'>
            <div className='size-9 rounded-md bg-muted flex items-center justify-center'>
              <MailIcon className='size-4' />
            </div>
            <div className='flex flex-col'>
              <p className='text-[13px] font-semibold text-muted-foreground'>
                Email address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className='text-sm hover:underline text-[#44a1e9]'
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
