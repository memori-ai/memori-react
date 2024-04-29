import React from 'react';

const QuestionHelp = ({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {...(!title ? { 'aria-hidden': 'true' } : {})}
    focusable="false"
    role="img"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    className={className}
    aria-label={title}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"></path>
    <path d="M12 17L12.01 17"></path>
  </svg>
);

export default QuestionHelp;
