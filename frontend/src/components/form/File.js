import React from 'react';
import { ReactComponent as FileIcon } from '../../assets/icons/file.svg';

function File({ value, onChange, onFileDelete, accept, text = 'PNG, JPG, GIF up to 10MB' }) {

  if (value) {

    return (
      <div
        className="relative flex w-full flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-y-auto subpixel-antialiased p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileIcon className="lucide lucide-image h-6 w-6 text-gray-500" />
            <div><p className="text-sm font-medium text-gray-900 dark:text-white">{value.filename}</p></div>
          </div>
          <button
            onClick={onFileDelete}
            type="button"
            className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-3 min-w-16 h-8 text-tiny gap-2 rounded-small [&amp;&gt;svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-danger/20 text-danger-600 dark:text-danger-500 data-[hover=true]:opacity-hover">Remove
          </button>
        </div>
        <div className="relative">
          <img
            src={value.uri}
            alt="Preview 1"
            className="h-48 w-full rounded-lg border border-gray-200 object-contain dark:border-gray-600"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
      <div className="text-center">
        <FileIcon />
        <div className="mt-4 flex text-sm/6 text-gray-600">
          <label htmlFor="file-upload"
                 className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500">
            <span>Upload a file</span>
            <input
              id="file-upload"
              type="file"
              name="file-upload"
              className="sr-only"
              onChange={onChange}
              accept={accept}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs/5 text-gray-600">{text}</p>
      </div>
    </div>
  );
}

export default File;
