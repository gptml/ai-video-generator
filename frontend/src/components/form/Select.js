import React from 'react';
import ReactSelect from 'react-select';
import classNames from 'classnames';


function Select(props) {
  return (
    <div className="w-64">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {props.label}
      </label>

      <ReactSelect
        {...props}
        placeholder={props.placeholder || props.label}
      />
    </div>
  );
}

export default Select;
