'use client';

import React from 'react';
import Toolbar from './toolbar';
import Sidebar from './Sidebar';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import WorkspaceSidebar from './WorkspaceSidebar';
import { UsePanel } from '@/hooks/UsePanel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/Thread';
import Profile from '@/features/members/components/Profile';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const { parentMessageId, onClose, profileMemberId } = UsePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className='h-full'>
      <Toolbar />
      <div className='flex h-[calc(100vh-40px)]'>
        <Sidebar />
        <ResizablePanelGroup
          direction='horizontal'
          autoSaveId={'tg-workspace-layout'}
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            className='bg-[#5e2c5f]'
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={80}>
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={29} minSize={20}>
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <Loader className='size-5 animate-spin text-muted-foreground' />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
