import React from 'react';

function RowSelect({ items, onClick, value, label }) {


  return (
    <div className="space-y-2"><label
      className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label} </label>
      <div className="flex cursor-pointer items-center gap-2 overflow-x-auto pb-2">
        {items.map(i => {
          const className = value === i.value ? 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
            : 'hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700'

          return (
            <button
              key={i.value}
              onClick={() => onClick(i.value)}
              type="button"
              className={`flex h-[40px] min-w-[66px] items-center justify-center space-x-2 rounded-lg border-2 p-3 transition-all ${className}`}
            >
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{i.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
}

export default RowSelect;
