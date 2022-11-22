import React from 'react';

const SoundDeactivated = ({
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
    viewBox="0 0 40 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label={title}
  >
    <path
      d="M25.085.277c-.264 0-.531.071-.777.236L8.482 10.857H1.161a.716.716 0 00-.715.714V24.43c0 .392.322.714.715.714h7.321l15.826 10.344c.246.16.518.236.777.236.745 0 1.433-.593 1.433-1.433V1.71c0-.84-.688-1.433-1.433-1.433zM23.304 30.99l-13.063-8.54-.803-.522H3.66V14.07h5.777l.799-.522 13.067-8.54V30.99zM39.534 15.148L36.967 18l2.567 2.852a1.09 1.09 0 010 1.427l-1.283 1.426a.845.845 0 01-1.284 0L34.4 20.852l-2.567 2.852a.845.845 0 01-1.283 0l-1.284-1.426a1.09 1.09 0 010-1.426L31.833 18l-2.567-2.852a1.09 1.09 0 010-1.426l1.283-1.427a.845.845 0 011.284 0l2.567 2.853 2.567-2.853a.845.845 0 011.284 0l1.283 1.427a1.09 1.09 0 010 1.426z"
      fill="currentColor"
    />
  </svg>
);

export default SoundDeactivated;
