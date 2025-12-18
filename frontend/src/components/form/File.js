import React from 'react';
import { FileIcon as ReactComponent } from '../assets/icons/file.svg';

function File(props) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <FileIcon />
      </div>
      <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">Click to upload or drag and drop</p><p
      className="text-xs text-gray-500 dark:text-gray-500">Supported formats: JPEG, PNG, WEBP Maximum file size:
      10MB</p>
      <button type="button"
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700">Select
        file
      </button>
    </div>
  );
}

export default File;
