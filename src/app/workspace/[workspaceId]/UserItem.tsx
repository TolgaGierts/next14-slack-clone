import { Button } from '@/components/ui/button';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Id } from '../../../../convex/_generated/dataModel';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';

const userItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f0edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface UserItemProps {
  id: Id<'members'>;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>['variant'];
}

const UserItem = ({ id, label = 'member', image, variant }: UserItemProps) => {
  const workspaceId = useWorkSpaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant={'transparent'}
      className={cn(userItemVariants({ variant }))}
      size={'sm'}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className='size-5 rounded-md mr-1'>
          <AvatarImage className='rounded-md' src={image} />
          <AvatarFallback className='rounded-md bg-sky-500 text-white text-sm'>
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className='text-sm truncate'>{label}</span>
      </Link>
    </Button>
  );
};

interface UserItemProps {}

export default UserItem;
