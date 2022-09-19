import { FieldErrors } from 'react-hook-form';

const getInputStyles = (
  errors: FieldErrors,
  type: string
) => `w-full p-2 leading-tight rounded shadow appearance-none text-slate-700 
${
  errors[type]
    ? 'outline outline-red-500 focus:outline-red-500'
    : 'focus:outline-slate-300'
}`;

export default {
  getInputStyles,
};
