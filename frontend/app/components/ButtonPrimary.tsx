import React from 'react';


interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  showArrow?: boolean; 
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ children, showArrow = false, className, ...props }) => {
  return (
    <button
      className={`w-full bg-restify-olive text-white font-semibold py-3 px-6 rounded-lg 
                  flex items-center justify-center gap-2 hover:bg-opacity-90 
                  transition duration-200 active:scale-[0.98] ${className || ''}`}
      {...props}
    >
      {children}
      {showArrow && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      )}
    </button>
  );
};