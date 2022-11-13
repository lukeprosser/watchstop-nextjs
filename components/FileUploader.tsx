import React, { useContext, useRef } from 'react';
import { UploadContext } from '../pages/admin/product/[id]';
import Spinner from './Spinner';

export default function FileUploader() {
  const value = useContext(UploadContext);
  if (!value) throw new Error('Upload context must be defined.');
  const { handleFileUpload, loading } = value;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput?.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    handleFileUpload(file);
  };

  return (
    <div className='w-1/3'>
      <button
        type='button'
        className='w-full px-3 py-2 text-xs rounded bg-skin-button-inverted text-skin-base hover:bg-skin-button-inverted-hover'
        onClick={handleClick}
      >
        {loading ? <Spinner size='4' message='Uploading...' /> : 'Upload'}
      </button>
      <input
        type='file'
        ref={hiddenFileInput}
        onChange={handleChange}
        className='hidden'
      />
    </div>
  );
}
