import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { HTMLInputTypeAttribute } from 'react';

interface InputProps {
  label?: string;
  name?: string | undefined;
  type?: HTMLInputTypeAttribute | undefined;
  value?: string | number | readonly string[] | undefined;
  placeholder?: string | undefined;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TwInput = ({
  label,
  name,
  type,
  value,
  placeholder,
  errorMessage,
  onChange,
}: InputProps) => {
  return (
    <div className="grid gap-2 text-sm font-medium text-[#344054]">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div>
        <Input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-12 rounded-sm focus-visible:ring-0 focus-visible:ring-transparent
            ${errorMessage ? 'border-red-400' : ''}`}
        />
        {errorMessage && (
          <>
            <div className="mt-1 ml-1 text-xs font-normal text-red-500">
              {errorMessage}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
