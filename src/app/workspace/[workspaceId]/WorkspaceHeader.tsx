import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Doc } from '../../../../convex/_generated/dataModel';
import { Hint } from '@/components/hint';
import {
  ChevronDown,
  ListFilter,
  Settings2,
  SquarePen,
  UserRoundPlus,
} from 'lucide-react';
import PreferencesModal from './PreferencesModal';
import { InviteModal } from './InviteModal';

interface WorkspaceHeaderProps {
  workspace: Doc<'workspaces'>;
  isAdmin: boolean;
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace.name}
        joinCode={workspace.joinCode}
      />
      <PreferencesModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />
      <div className='flex items-center justify-between px-4 h-[49px] gap-0.5'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={'transparent'}
              className='font-semibold text-lg w-auto p-1.5 overflow-hidden'
            >
              <span className='text-white truncate'>{workspace.name}</span>
              <ChevronDown className='size-4 ml-1 shrink-0 text-white' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start' className='w-64'>
            <DropdownMenuItem className='cursor-pointer capitalize'>
              <div className='size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-10'>
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className='flex flex-col items-start'>
                <p className='font-bold'>{workspace.name}</p>
                <p className='text-xs text-muted-foreground'>
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>
            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='cursor-pointer py-2 flex items-center justify-start'
                  onClick={() => setInviteOpen(true)}
                >
                  <UserRoundPlus className='size-4 mr-2' />
                  Invite People to {workspace.name}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer py-2 flex items-center justify-start'
                  onClick={() => setPreferencesOpen(true)}
                >
                  <Settings2 className='size-4 mr-2' />
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className='flex items-center gap-0.5'>
          <Hint label={'Filter conversations'} side='bottom'>
            <Button variant={'transparent'} size={'iconSm'}>
              <ListFilter className='size-4' />
            </Button>
          </Hint>
          <Hint label={'New Message'} side='bottom'>
            <Button variant={'transparent'} size={'iconSm'}>
              <SquarePen className='size-4' />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};

export default WorkspaceHeader;
