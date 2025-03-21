import React from 'react';

const Alert = ({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) => (
  <svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    {...(!title ? { 'aria-hidden': 'true' } : {})}
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={title}
    color="currentColor"
  >
    <path
      d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Alert;
