import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';

const Previous = () => (
  <div className='flex items-center w-6 h-6 mx-auto mb-2 text-lg text-skin-inverted rounded-full md:w-8 md:h-8 bg-skin-fill-accent'>
    <CheckIcon className='block w-4 h-4 mx-auto md:w-6 md:h-6' />
  </div>
);

const Current = () => (
  <div className='w-6 h-6 mx-auto mb-2 border-4 rounded-full md:w-8 md:h-8 border-skin-accent'></div>
);

const Next = () => (
  <div className='w-6 h-6 mx-auto mb-2 border-2 border-skin-muted rounded-full md:w-8 md:h-8'></div>
);

export default function Stepper({
  steps = ['One', 'Two', 'Three'],
  activeStep = 0,
}) {
  return (
    <div className='w-full py-6'>
      <div className='flex'>
        {steps.map((step, idx) => (
          // Width workaround - Tailwind can't process dynamically interpolated values at build time
          <div key={step} style={{ width: `calc(100% / ${steps.length})` }}>
            <div className='relative'>
              {idx < activeStep ? (
                <Previous />
              ) : idx === activeStep ? (
                <Current />
              ) : (
                <Next />
              )}
              {idx > 0 && idx < steps.length && (
                <div
                  className={`absolute -translate-x-1/2 -translate-y-1/2 top-1/2 w-[calc(100%-2.5rem)] md:w-[calc(100%-4rem)] py-0.5 rounded ${
                    idx < activeStep + 1
                      ? 'bg-skin-fill-accent'
                      : 'bg-skin-fill-inverted-muted'
                  }`}
                ></div>
              )}
            </div>
            <div className='text-xs font-light text-center md:text-sm lg:text-base'>
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
