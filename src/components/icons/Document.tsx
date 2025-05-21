import React from 'react';

export const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M14 2.5H6C5.60218 2.5 5.22064 2.65804 4.93934 2.93934C4.65804 3.22064 4.5 3.60218 4.5 4V20C4.5 20.3978 4.65804 20.7794 4.93934 21.0607C5.22064 21.342 5.60218 21.5 6 21.5H18C18.3978 21.5 18.7794 21.342 19.0607 21.0607C19.342 20.7794 19.5 20.3978 19.5 20V8L14 2.5Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M14 2.5V8H19.5" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16 13H8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M16 17H8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M10 9H8" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DocumentIcon;
