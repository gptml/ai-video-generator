import React from 'react';

function Textarea({ label, required, onChange, value, placeholder, hint }) {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}
        {required ? <span className="text-red-500">*</span> : null}
      </label>
      <textarea
        onChange={onChange}
        value={value}
        rows="4"
        maxLength="5000"
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
      />
      {hint ? <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p> : null}
    </div>
  );
}

export default Textarea;
