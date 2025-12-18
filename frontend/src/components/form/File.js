import React from 'react';

function File(props) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
     
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
