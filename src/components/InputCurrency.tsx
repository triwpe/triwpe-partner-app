import React, { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';

interface InputCurrencyProps {
  name?: string | undefined;
  placeholder?: string | undefined;
  value?: string | number | readonly string[] | undefined;
  onChange: (value: string) => void;
  currency: string;
}

const InputCurrency = ({
  name,
  placeholder,
  value,
  onChange,
  currency,
}: InputCurrencyProps) => {
  const handleChange = (value: string) => {
    if (!value) return;

    const currencyValue = value.replace(/\D/g, '');

    const decimalPart = currencyValue.slice(-2);
    let integerPart = currencyValue.slice(0, -2);

    if (integerPart === '') integerPart = '0';

    integerPart = integerPart.replace(/^0+/, '') || '0';

    let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    let formattedCurrency = `${formattedInteger}.${decimalPart}`;

    onChange(formattedCurrency ?? '');
  };

  return (
    <>
      <div className="flex">
        <Input
          name={name}
          className="w-1/3 h-14 border-[#d9d9d9] rounded rounded-l-md rounded-r-none text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
        />
        <div className="flex w-16 h-14 justify-center items-center border border-l-0 border-[#d9d9d9] bg-[#f0f0f0] rounded rounded-l-none rounded-r-md text-[#535773] font-medium">
          <span>{currency}</span>
        </div>
      </div>
    </>
  );
};

export default InputCurrency;
