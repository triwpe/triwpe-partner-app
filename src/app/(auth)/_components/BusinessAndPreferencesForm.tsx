'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Circle, CircleCheck, Loader2, User } from 'lucide-react';

import { signUp as signUpAction } from '@/actions/partner';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  businessAndPreferencesCompanySchema,
  businessAndPreferencesIndividualSchema,
} from '@/lib/zod';
import FormAlert from './FormAlert';
import { set } from 'zod';
import { PartnerDetailCreateModel } from '@/types/models/partner-details';

interface BusinessAndPreferencesFormProps {
  partnerDetails: PartnerDetailCreateModel | null;
  onSuccess: (data: PartnerDetailCreateModel) => void;
}

export default function BusinessAndPreferencesForm({
  partnerDetails,
  onSuccess,
}: BusinessAndPreferencesFormProps) {
  const [businessType, setBusinessType] = useState<string>(
    partnerDetails?.businessType || 'company',
  );
  const [companyName, setCompanyName] = useState<string>(
    partnerDetails?.companyName || '',
  );
  const [firstName, setFirstName] = useState<string>(
    partnerDetails?.firstName || '',
  );
  const [lastName, setLastName] = useState<string>(
    partnerDetails?.lastName || '',
  );
  const [registeredCountry, setRegisteredCountry] = useState<
    string | undefined
  >(partnerDetails?.registeredCountry || undefined);
  const [paymentCurrency, setPaymentCurrency] = useState<string | undefined>(
    partnerDetails?.paymentCurrency || undefined,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<any[]>([]);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setFormErrors([]);
    setSignUpError(null);

    const businessAndPreferencesSchema =
      businessType === 'company'
        ? businessAndPreferencesCompanySchema
        : businessAndPreferencesIndividualSchema;
    const response = await businessAndPreferencesSchema.safeParseAsync({
      businessType: businessType,
      companyName: companyName,
      firstName: firstName,
      lastName: lastName,
      registeredCountry: registeredCountry,
      paymentCurrency: paymentCurrency,
    });

    if (response.success) {
      const partnerDetails: PartnerDetailCreateModel = {
        businessType: businessType,
        companyName: companyName,
        firstName: firstName,
        lastName: lastName,
        registeredCountry: registeredCountry ?? '',
        paymentCurrency: paymentCurrency ?? '',
      };
      onSuccess(partnerDetails);
    } else {
      await addError(response.error);
    }
    setIsLoading(false);
  };

  const handleSelectBusinessType = (type: string) => {
    setFormErrors([]);

    setCompanyName('');
    setFirstName('');
    setLastName('');

    setBusinessType(type);
  };

  const addError = async (error: any) => {
    let errArr: any[] = [];
    const { errors: err } = error;
    for (var i = 0; i < err.length; i++) {
      errArr.push({ for: err[i].path[0], message: err[i].message });
    }
    setFormErrors(errArr);
  };

  return (
    <>
      <Card className="w-full md:w-[576px] py-5 px-7 text-[#344054] shadow-none border-[#e0e0e0] rounded-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span className="text-2xl">Join the Crew! ✈️</span>
              <span className="text-base text-[#969696] font-medium">
                Step 1 of 2
              </span>
            </CardTitle>
            <CardDescription className="text-base text-[#969696]">
              Tell us about your business and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8">
              <div className="grid gap-2">
                <Label htmlFor="email">What is your business type?</Label>
                <div>
                  <Button
                    className={`w-full h-14 rounded-b-none justify-between items-center ${businessType === 'company' ? 'text-white border-[#2a77e9] bg-[#2a77e9]' : 'border-[#d9d9d9] text-[#535773]'}`}
                    type="button"
                    variant="tw_outline"
                    onClick={() => handleSelectBusinessType('company')}
                  >
                    <div className="flex">
                      <Building2 strokeWidth={2} className="w-5 h-5" />
                      <span className="text-base ml-4">Company</span>
                    </div>
                    {businessType === 'company' ? (
                      <CircleCheck className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    className={`-mt-[1px] w-full h-14 rounded-t-none justify-between items-center ${businessType === 'individual' ? 'text-white border-[#2a77e9] bg-[#2a77e9]' : 'border-[#d9d9d9] text-[#535773]'}`}
                    type="button"
                    variant="tw_outline"
                    onClick={() => handleSelectBusinessType('individual')}
                  >
                    <div className="flex">
                      <User strokeWidth={2} className="w-5 h-5" />
                      <span className="text-base ml-4">Individual</span>
                    </div>
                    {businessType === 'individual' ? (
                      <CircleCheck className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </Button>
                  {formErrors.find((error) => error.for === 'businessType') && (
                    <div className="mt-1 ml-1 text-xs text-red-600">
                      {
                        formErrors.find((error) => error.for === 'businessType')
                          ?.message
                      }
                    </div>
                  )}
                </div>
              </div>
              {businessType === 'company' && (
                <div className="grid gap-2">
                  <Label htmlFor="email">Company name</Label>
                  <div>
                    <Input
                      name="company-name"
                      placeholder="Enter the company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                        formErrors.some((error) => error.for === 'companyName')
                          ? 'border-red-600'
                          : ''
                      }`}
                    />
                    {formErrors.find(
                      (error) => error.for === 'companyName',
                    ) && (
                      <div className="mt-1 ml-1 text-xs text-red-600">
                        {
                          formErrors.find(
                            (error) => error.for === 'companyName',
                          )?.message
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}
              {businessType === 'individual' && (
                <div className="grid gap-2">
                  <div className="flex gap-2">
                    <div>
                      <Label htmlFor="email">First Name</Label>
                      <div>
                        <Input
                          name="first-name"
                          placeholder="Enter your first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                            formErrors.some(
                              (error) => error.for === 'firstName',
                            )
                              ? 'border-red-600'
                              : ''
                          }`}
                        />
                        {formErrors.find(
                          (error) => error.for === 'firstName',
                        ) && (
                          <div className="mt-1 ml-1 text-xs text-red-600">
                            {
                              formErrors.find(
                                (error) => error.for === 'firstName',
                              )?.message
                            }
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Last Name</Label>
                      <div>
                        <Input
                          name="last-name"
                          placeholder="Enter your last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={`h-14 border-[#d9d9d9] text-[#535773] focus-visible:ring-0 focus-visible:ring-transparent ${
                            formErrors.some((error) => error.for === 'lastName')
                              ? 'border-red-600'
                              : ''
                          }`}
                        />
                        {formErrors.find(
                          (error) => error.for === 'lastName',
                        ) && (
                          <div className="mt-1 ml-1 text-xs text-red-600">
                            {
                              formErrors.find(
                                (error) => error.for === 'lastName',
                              )?.message
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Where is your business registered?
                </Label>
                <div>
                  <Select
                    value={registeredCountry}
                    onValueChange={(e) => setRegisteredCountry(e)}
                  >
                    <SelectTrigger
                      name="registered-country"
                      aria-label="Select status"
                      className={`h-14 border-[#d9d9d9] text-[#535773] focus:ring-0 focus:ring-transparent ${
                        formErrors.some(
                          (error) => error.for === 'registeredCountry',
                        )
                          ? 'border-red-600'
                          : ''
                      }`}
                    >
                      <SelectValue placeholder="Select the country" />
                    </SelectTrigger>
                    <SelectContent className="text-[#535773] hover:text-[#535773]">
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="br">Brazil</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="cn">China</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="it">Italy</SelectItem>
                      <SelectItem value="jp">Japan</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                      <SelectItem value="es">Spain</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.find(
                    (error) => error.for === 'registeredCountry',
                  ) && (
                    <div className="mt-1 ml-1 text-xs text-red-600">
                      {
                        formErrors.find(
                          (error) => error.for === 'registeredCountry',
                        )?.message
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">
                  What is your preferred payment currency?
                </Label>
                <div>
                  <Select
                    value={paymentCurrency}
                    onValueChange={(e) => setPaymentCurrency(e)}
                  >
                    <SelectTrigger
                      name="payment-currency"
                      aria-label="Select status"
                      className={`h-14 border-[#d9d9d9] text-[#535773] focus:ring-0 focus:ring-transparent ${
                        formErrors.some(
                          (error) => error.for === 'paymentCurrency',
                        )
                          ? 'border-red-600'
                          : ''
                      }`}
                    >
                      <SelectValue placeholder="Select the currency" />
                    </SelectTrigger>
                    <SelectContent className="text-[#535773]">
                      <SelectItem value="usd">U.S. Dolar ($)</SelectItem>
                      <SelectItem value="eur">Euro (€)</SelectItem>
                      <SelectItem value="gbp">British Pound (£)</SelectItem>
                      <SelectItem value="brl">Brazilian Real (R$)</SelectItem>
                    </SelectContent>
                  </Select>{' '}
                  {formErrors.find(
                    (error) => error.for === 'paymentCurrency',
                  ) && (
                    <div className="mt-1 ml-1 text-xs text-red-600">
                      {
                        formErrors.find(
                          (error) => error.for === 'paymentCurrency',
                        )?.message
                      }
                    </div>
                  )}
                </div>
              </div>
              <Button
                className="w-full h-14 bg-[#1fd79b] text-[#344054] text-base hover:bg-[#1fd79b]"
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="underline font-medium text-[#0154b3]">
          Sign in instead
        </Link>
      </div>
    </>
  );
}
