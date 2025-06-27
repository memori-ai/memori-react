import React from 'react';

const ChevronDown = ({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) => (
  <svg
    {...(!title ? { 'aria-hidden': 'true' } : {})}
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    className={className}
    aria-label={title}
  >
    <path d="M6 9L12 15 18 9"></path>
  </svg>
);

export default ChevronDown; 