import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Spinner({
  size,
  message,
}: {
  size: string;
  message?: string;
}) {
  return (
    <div className='flex items-center justify-center'>
      <ArrowPathIcon
        className={`w-${size} h-${size} inline mr-2 animate-spin`}
      />
      {message}
    </div>
  );
}
