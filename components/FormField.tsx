import React from 'react';
import { FieldErrorsImpl, UseFormRegisterReturn } from 'react-hook-form';

export default function FormField({
  id,
  label,
  type,
  placeholder,
  errors,
  register,
  validationError,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  errors: FieldErrorsImpl;
  register: UseFormRegisterReturn;
  validationError: string;
}) {
  return (
    <div className='mb-4'>
      <label
        htmlFor={id}
        className='block mb-2 font-medium tracking-wide text-slate-700'
      >
        {label}
      </label>
      <input
        className={`text-sm w-full p-2 leading-tight rounded shadow appearance-none text-slate-700 outline outline-1 focus:outline-2 ${
          errors[id] ? 'outline-red-500' : 'outline-slate-300'
        }`}
        id={id}
        type={type}
        placeholder={placeholder}
        {...register}
      />
      {errors[id] ? (
        <span className='block mt-1 text-xs text-red-500'>
          {validationError}
        </span>
      ) : (
        ''
      )}
    </div>
  );
}
