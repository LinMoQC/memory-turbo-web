'use client'

import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { useFormStatus } from 'react-dom';

interface SubmitButtonProps extends PropsWithChildren {
  className?: string; 
}

const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className={`w-full ${className}`} 
    >
      {pending ? <LoaderCircle className="animate-spin" size={16} strokeWidth={2} aria-hidden="true" /> : children}
    </Button>
  );
}

export default SubmitButton;
