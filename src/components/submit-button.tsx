'use client'

import { Button } from '@/components/ui/button';
import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps extends PropsWithChildren {
  className?: string; // Change CSSProperties to string
}

const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className={`w-full ${className}`} 
    >
      {pending ? 'Submitting...' : children}
    </Button>
  );
}

export default SubmitButton;
