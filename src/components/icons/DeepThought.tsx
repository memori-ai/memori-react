import React from 'react';

const DeepThought = ({
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
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="3"
    width="20"
    height="20"
    viewBox="0 0 48 48"
    className={className}
    aria-label={title}
  >
    <path
      d="M30.106 48v-2.745a2.213 2.213 0 012.213-2.212h6.11a2.392 2.392 0 002.326-2.466v-3.223a1.834 1.834 0 01.459-1.145 2.912 2.912 0 00.712-1.926l-.007-.667a1.016 1.016 0 01.651-.952h1.067a1.363 1.363 0 001.051-.456 1.304 1.304 0 00.19-1.395 67.032 67.032 0 01-3.037-7.51 4.767 4.767 0 01-.217-1.507l-.002-4.994a14.513 14.513 0 00-.552-3.963l-.006-.022a13.959 13.959 0 00-3.137-5.702q-.479-.516-1.006-1.003a17.67 17.67 0 00-.677-.623A18.303 18.303 0 0024.194 1a19.617 19.617 0 00-12.539 4.489 17.555 17.555 0 00-3.945 21.69C9.945 31.507 11.694 38.622 12.14 46v2"
      strokeMiterlimit={10}
    ></path>
    <path d="M27.917 12L31.417 12"></path>
    <path d="M27.917 26L31.417 26"></path>
    <path d="M29.667 12L29.667 26"></path>
    <path d="M23.992 26L19.904 12 19.226 12 15.159 26"></path>
    <path d="M16.854 21.133L22.276 21.133"></path>
  </svg>
);

export default DeepThought;
