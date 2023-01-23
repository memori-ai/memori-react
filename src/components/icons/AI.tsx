import React from 'react';

const AI = ({ className, title }: { className?: string; title?: string }) => (
  <svg
    {...(!title ? { 'aria-hidden': 'true' } : {})}
    focusable="false"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-label={title}
  >
    <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
      <path
        fillRule="evenodd"
        d="M0 4a4 4 0 014-4h16a4 4 0 014 4v16a4 4 0 01-4 4H4a4 4 0 01-4-4zm4-2.4A2.4 2.4 0 001.6 4v16A2.4 2.4 0 004 22.4h16a2.4 2.4 0 002.4-2.4V4A2.4 2.4 0 0020 1.6z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M9.715 8.442a.798.798 0 00-1.43 0l-3.2 6.4a.799.799 0 101.431.716l.579-1.158h3.811l.578 1.158a.8.8 0 001.431-.716zm.391 4.358L9 10.589 7.894 12.8z"
        clipRule="evenodd"
      ></path>
      <path
        fillRule="evenodd"
        d="M17 8c.552 0 1 .358 1 .8v6.4c0 .442-.448.8-1 .8s-1-.358-1-.8V8.8c0-.442.448-.8 1-.8z"
        clipRule="evenodd"
      ></path>
    </g>
  </svg>
);

export default AI;
