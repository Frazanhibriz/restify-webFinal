import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, id, ...props }) => {
  return (
    <div className="w-full mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-restify-text-dark mb-1.5">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-restify-cream border border-gray-200 rounded-lg py-3 px-4 
                   text-restify-text-dark placeholder:text-gray-400
                   focus:ring-2 focus:ring-restify-olive/50 focus:border-restify-olive outline-none 
                   transition"
        {...props}
      />
    </div>
  );
};