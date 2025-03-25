import React from 'react';

const Info = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    {...(!title ? { 'aria-hidden': 'true' } : {})}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={title}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M12 17V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="1"
      cy="1"
      r="1"
      transform="matrix(1 0 0 -1 11 9)"
      fill="currentColor"
    />
  </svg>
);

export default Info;
