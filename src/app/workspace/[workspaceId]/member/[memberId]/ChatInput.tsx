import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import Quill from 'quill';
import { useCreateMessage } from '@/features/messages/api/useCreateMessage';
import { useWorkSpaceId } from '@/hooks/useWorkSpaceId';

import { toast } from 'sonner';
import { useGenerateUploadUrl } from '@/features/upload/api/useGenerateUploadUrl';
import { Id } from '../../../../../../convex/_generated/dataModel';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<'conversations'>;
}

type CreateMessageValues = {
  conversationId: Id<'conversations'>;
  workspaceId: Id<'workspaces'>;
  body: string;
  image: Id<'_storage'> | undefined;
};

const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [isPending, setIsPending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkSpaceId();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        conversationId,
        workspaceId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) {
          throw new Error('Failed to generate upload url');
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, { throwError: true });
      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
    }
  };

  return (
    <div className='px-5 w-full'>
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
