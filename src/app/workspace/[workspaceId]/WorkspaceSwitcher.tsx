import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';
import { useGetWorkspace } from '@/features/workspaces/api/useGetWorkspace';
import { useGetWorkspaces } from '@/features/workspaces/api/useGetWorkspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/useCreateWorkspaceModal';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { log } from 'console';

const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkSpaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter((workspace) => {
    workspace?._id === workspaceId;
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='size-9 overflow-hidden relative bg-[#ababad] hover:bg-[#ababad]/80 text-slate-800 font-semibold text-xl'>
          {workspaceLoading ? (
            <Loader className='animate-spin size-5 hover:shrink-0' />
          ) : (
            workspace?.name.charAt(0).toUpperCase()
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start' className='w-64'>
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className='cursor-pointer flex-col justify-start items-start capitalize'
        >
          {workspace?.name}
          <span className='text-xs text-muted-foreground'>
            Active Workspace
          </span>
        </DropdownMenuItem>
        {workspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className='cursor-pointer capitalize overflow-hidden'
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className='size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md items-center justify-center flex mr-2'>
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className='truncate'>{workspace.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className='cursor-pointer'
          onClick={() => setOpen(true)}
        >
          <div className='size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md items-center justify-center flex mr-2'>
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSwitcher;
