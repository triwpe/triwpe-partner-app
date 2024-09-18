import { Command as CommandPrimitive } from 'cmdk';
import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  useEffect,
} from 'react';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { NextApiRequest, NextApiResponse } from 'next';
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Skeleton } from '../ui/skeleton';
import { getLocation } from '@/actions/location';

type ResponseData = {
  data: Option[];
};

export type Option = Record<'value' | 'label', string> & Record<string, string>;

type AutoCompleteProps = {
  emptyMessage: string;
  value?: Option;
  onValueChange?: (value: Option | undefined) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export const LocationAutoComplete = ({
  placeholder,
  emptyMessage,
  value,
  onValueChange,
  disabled,
  isLoading = false,
}: AutoCompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isOpen, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>(value?.label || '');
  const [locations, setLocations] = useState<Option[]>([]);

  // Update isOpen based on inputValue length
  useEffect(() => {
    if (inputValue && inputValue.length > 3) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [inputValue]);

  const handleKeyUp = useCallback(
    async (event: KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      // Reset onValueChange if delete or backspace key is pressed
      if (event.key === 'Delete' || event.key === 'Backspace') {
        onValueChange?.(undefined);
      }

      if (input.value && input.value.length >= 3) {
        const data = await getLocation(input.value);

        setLocations(data.features);
      }

      // This is not a default behaviour of the <input /> field
      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = locations.find(
          (location) => location.place_name === input.value,
        );
        if (optionToSelect) {
          setSelected(optionToSelect);
          onValueChange?.(optionToSelect);
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [locations, onValueChange],
  );

  const handleBlur = useCallback(() => {
    setOpen(false);
    setInputValue(selected?.place_name ?? '');
  }, [selected]);

  const handleSelectOption = useCallback(
    (selectedOption: Option) => {
      setInputValue(selectedOption.place_name);

      setSelected(selectedOption);
      onValueChange?.(selectedOption);

      // This is a hack to prevent the input from being focused after the user selects an option
      // We can call this hack: "The next tick"
      setTimeout(() => {
        inputRef?.current?.blur();
      }, 0);
    },
    [onValueChange],
  );

  return (
    <CommandPrimitive
      onKeyUp={handleKeyUp}
      className={`${isOpen ? 'rounded-b-none' : 'rounded-b-md'} border shadow-none rounded-t-md border-[#d9d9d9]`}
    >
      <div>
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={(newValue) => {
            if (!isLoading) {
              setInputValue(newValue);
              setSelected(undefined); // Clear selected option when input changes
            }
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="h-14 text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent"
        />
      </div>
      <div className="relative w-full">
        <div
          className={cn(
            'animate-in fade-in-0 absolute top-0 z-10 w-full rounded-t-none rounded-b-md border border-white bg-white outline outline-1 outline-[#d9d9d9]',
            isOpen ? 'block' : 'hidden',
          )}
        >
          <CommandList>
            {isLoading ? (
              <CommandPrimitive.Loading>
                <div className="p-1">
                  <Skeleton className="h-14 w-full" />
                </div>
              </CommandPrimitive.Loading>
            ) : null}
            {locations.length > 0 && !isLoading ? (
              <CommandGroup>
                {locations.map((location) => {
                  const isSelected = selected?.value === location.id;
                  return (
                    <CommandItem
                      key={location.id}
                      value={location.place_name}
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onSelect={() => handleSelectOption(location)}
                      className={cn(
                        'flex w-full items-center gap-2 h-14',
                        !isSelected ? 'pl-8' : null,
                      )}
                    >
                      {isSelected ? <Check className="w-4" /> : null}
                      {location.place_name}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ) : null}
            {!isLoading ? (
              <CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
                {emptyMessage}
              </CommandPrimitive.Empty>
            ) : null}
          </CommandList>
        </div>
      </div>
    </CommandPrimitive>
  );
};
