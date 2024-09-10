'use client';

import { Button } from '@/components/ui/button';
import { UseGetWorkspaceInfo } from '@/features/workspaces/api/useGetWorkspaceInfo';
import { useJoin } from '@/features/workspaces/api/useJoin';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';
import VerificationInput from 'react-verification-input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const JoinPage = () => {
  const workspaceId = useWorkSpaceId();

  const router = useRouter();

  const { data, isLoading } = UseGetWorkspaceInfo({ id: workspaceId });
  const { mutate, isPending } = useJoin();

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  }, [isMember, router, workspaceId]);

  const handleJoin = (value: string) => {
    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          // Redirect to workspace page
          toast.success('Successfully joined workspace');
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error('Failed to join workspace');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader className='size-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md'>
      <Image src={'/hashtag.svg'} width={60} height={60} alt='logo' />
      <div className='flex flex-col gap-y-4 items-center justify-center max-w-md'>
        <div className='flex flex-col gap-y-2 items-center justify-center'>
          <h1 className='text-2xl font-bold'>Join {data?.name}</h1>
          <p className='text-md text-muted-foreground'>
            Enter the workspace code
          </p>
        </div>
        <VerificationInput
          onComplete={handleJoin}
          classNames={{
            container: cn(
              'flex gap-x-2',
              isPending && 'opacity-50 cursor-not-allowed'
            ),
            character:
              ' uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500 focus:border-primary-foreground focus:outline-none focus:ring-1 focus:ring-primary-foreground focus:ring-opacity-50',
            characterInactive: 'bg-muted',
            characterSelected: 'bg-white text-black',
            characterFilled: 'bg-white text-black',
          }}
          autoFocus
          length={6}
        />
      </div>
      <div className='flex gap-x-4'>
        <Button size={'lg'} variant={'outline'} asChild>
          <Link href={'/'}>Back to home</Link>
        </Button>
      </div>
    </div>
  );
};

export default JoinPage;
