import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface EmojiPopoverProps {
  children: React.ReactNode;
  hint?: string;
  onEmojiSelect: (emoji: any) => void;
}

const EmojiPopover = ({
  children,
  hint = 'Emoji',
  onEmojiSelect,
}: EmojiPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tooptipOpen, setTooltipOpen] = useState(false);

  const onSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setPopoverOpen(false);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 500);
  };

  return (
    <TooltipProvider>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <Tooltip
          open={tooptipOpen}
          onOpenChange={setTooltipOpen}
          delayDuration={50}
        >
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className='bg-black text-white border-white/5'>
            <p className='font-medium text-xs'>{hint}</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className='p-0 w-full border-none shadow-none'>
          <Picker data={data} onEmojiSelect={onSelect} />
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
};

export default EmojiPopover;
