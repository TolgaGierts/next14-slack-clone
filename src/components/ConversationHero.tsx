import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

export const ConversationHero = ({
  name = 'Member',
  image,
}: ConversationHeroProps) => {
  return (
    <div className='mt-[44px] mx-5 mb-4'>
      <div className='flex items-center gap-x-1 mb-2'>
        <Avatar className='size-14 mr-2'>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <p className='text-2xl font-bold'>{name}</p>
      </div>
      <p className='font-normal text-xs text-slate-800 mb-4'>
        This conversation is just between you and <strong>{name}</strong>. You
        can share messages, images, and files.
      </p>
    </div>
  );
};
