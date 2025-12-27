import React from 'react';

function Input({ id, label, name, type = 'text', placeholder = '', onChange, value, className = '', ...props }) {
  return (
    <div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">{label}</label>
        <input
          {...props}
          id={id}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className={`w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none ${className}`}
        />
      </div>
    </div>

  );
}

export default Input;
