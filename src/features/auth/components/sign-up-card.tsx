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
import { TriangleAlert } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  const { signIn } = useAuthActions();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const handleProviderSignUp = (value: 'google' | 'github') => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  const handlePasswordSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setPending(false);
      return;
    }
    signIn('password', { name, email, password, flow: 'signUp' })
      .catch((e) => {
        setError(e.message);
        console.error(e);
      })
      .finally(() => {
        setPending(false);
      });
  };

  return (
    <Card className='w-full h-full p-8'>
      <CardHeader className='px-0 pt-0'>
        <CardTitle>Sign up to continue</CardTitle>
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
        <form onSubmit={handlePasswordSignUp} className='space-y-2.5'>
          <Input
            disabled={pending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder='Full name'
            required
          />

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
          <Input
            disabled={pending}
            type='password'
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            placeholder='Confirm Password'
            required
          />
          <Button
            type='submit'
            className='w-full'
            size={'lg'}
            disabled={pending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className='flex flex-col gap-y-2.5'>
          <Button
            onClick={() => handleProviderSignUp('google')}
            className='w-full relative'
            variant={'outline'}
            size={'lg'}
            disabled={pending}
          >
            <FcGoogle className=' size-5 absolute left-2.5 top-1/2 transform -translate-y-1/2' />
            Continue with Google
          </Button>
          <Button
            onClick={() => handleProviderSignUp('github')}
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
          Already have an account?{' '}
          <span
            onClick={() => setState('signIn')}
            className='text-sky-700 hover:underline cursor-pointer'
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
