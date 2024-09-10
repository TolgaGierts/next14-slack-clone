import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState } from 'react';
import { SignInFlow } from '../types';
import { useAuthActions } from '@convex-dev/auth/react';
import { TriangleAlert } from 'lucide-react';

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handlePasswordSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn('password', { email, password, flow: 'signIn' })
      .catch((e) => {
        setError('Invalid email or password');
        console.error(e);
      })
      .finally(() => {
        setPending(false);
      });
  };

  const handleProviderSignIn = (value: 'google' | 'github') => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Log in to continue</CardTitle>
        <CardDescription>
          Use your email or another service to log in.
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className='bg-destructive/15 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6 p-2'>
          <TriangleAlert className='size-4' />
          <p>{error}</p>
        </div>
      )}
      <CardContent className='space-y-5 px-0 pb-0'>
        <form className='space-y-2.5' onSubmit={handlePasswordSignIn}>
          <Input
            disabled={pending}
            type='email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder='Email'
            required
          />
          <Input
            disabled={pending}
            type='password'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder='Password'
            required
          />
          <Button type='submit' className='w-full' size={'lg'} disabled={false}>
            Continue
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button
            onClick={() => handleProviderSignIn('google')}
            className='w-full relative'
            variant={'outline'}
            size={'lg'}
            disabled={pending}
          >
            <FcGoogle className=' size-5 absolute left-2.5 top-1/2 transform -translate-y-1/2' />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleProviderSignIn('github')}
            className='w-full relative'
            variant={'outline'}
            size={'lg'}
            disabled={pending}
          >
            <FaGithub className=' size-5 absolute left-2.5 top-1/2 transform -translate-y-1/2' />
            Continue with Github
          </Button>
        </div>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <span
            onClick={() => setState('signUp')}
            className='text-sky-700 hover:underline cursor-pointer'
          >
            Sign up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
