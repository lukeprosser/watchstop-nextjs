import React from 'react';
import { FieldErrorsImpl, UseFormRegisterReturn } from 'react-hook-form';
import FileUploader from './FileUploader';

const Input = ({
  id,
  placeholder,
  type,
  step,
  errors,
  register,
}: {
  id: string;
  placeholder: string;
  type: string;
  step?: string;
  errors: FieldErrorsImpl;
  register: UseFormRegisterReturn;
}) => (
  <input
    className={`text-sm w-full p-2 leading-tight rounded shadow appearance-none text-skin-muted outline outline-1 focus:outline-2 ${
      errors[id] ? 'outline-skin-error' : 'outline-skin-muted'
    }`}
    id={id}
    type={type}
    placeholder={placeholder}
    {...register}
    step={step}
  />
);

const TextArea = ({
  id,
  placeholder,
  errors,
  register,
}: {
  id: string;
  placeholder: string;
  errors: FieldErrorsImpl;
  register: UseFormRegisterReturn;
}) => (
  <textarea
    className={`text-sm w-full p-2 leading-tight rounded shadow appearance-none text-skin-muted outline outline-1 focus:outline-2 ${
      errors[id] ? 'outline-skin-error' : 'outline-skin-muted'
    }`}
    id={id}
    placeholder={placeholder}
    rows={6}
    {...register}
  />
);

export default function FormField({
  id,
  label,
  type,
  placeholder,
  step,
  errors,
  register,
  validationError,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  step?: string;
  errors: FieldErrorsImpl;
  register: UseFormRegisterReturn;
  validationError: string;
}) {
  return (
    <div className='mb-4'>
      <label
        htmlFor={id}
        className='block mb-2 font-medium tracking-wide text-skin-muted'
      >
        {label}
      </label>
      {type === 'textarea' ? (
        <TextArea
          id={id}
          placeholder={placeholder}
          errors={errors}
          register={register}
        />
      ) : id === 'image' ? (
        <div className='flex justify-between gap-2 items-center'>
          <Input
            id={id}
            placeholder={placeholder}
            type={type}
            step={step}
            errors={errors}
            register={register}
          />
          <FileUploader />
        </div>
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          type={type}
          step={step}
          errors={errors}
          register={register}
        />
      )}
      {errors[id] ? (
        <span className='block mt-1 text-xs text-skin-error'>
          {validationError}
        </span>
      ) : (
        ''
      )}
    </div>
  );
}
