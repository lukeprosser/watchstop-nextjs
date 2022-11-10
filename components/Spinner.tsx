import { ArrowPathIcon } from '@heroicons/react/24/outline';

const sizeMap = {
  '1': 'w-1 h-1',
  '2': 'w-2 h-2',
  '3': 'w-3 h-3',
  '4': 'w-4 h-4',
  '5': 'w-5 h-5',
  '6': 'w-6 h-6',
  '7': 'w-7 h-7',
  '8': 'w-8 h-8',
};

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
        className={`${
          sizeMap[size as keyof typeof sizeMap]
        } inline mr-2 animate-spin`}
      />
      {message}
    </div>
  );
}
