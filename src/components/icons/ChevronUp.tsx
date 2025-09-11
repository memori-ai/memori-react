import * as React from "react"
const ChevronUp = ({
    className,
    title,
  }: {
    className?: string;
    title?: string;
  }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={800}
    height={800}
    viewBox="0 0 52 52"
    {...(!title ? { 'aria-hidden': 'true' } : {})}
    focusable="false"
    role="img"
    className={className}
    aria-label={title}
  >
    <path d="m4.4 34.2 20.5-20.7c.6-.6 1.6-.6 2.2 0l20.5 20.7c.6.6.6 1.6 0 2.2l-2.2 2.2c-.6.6-1.6.6-2.2 0L27.1 22.2c-.6-.6-1.6-.6-2.2 0L8.8 38.5c-.6.6-1.6.6-2.2 0l-2.2-2.2c-.5-.6-.5-1.5 0-2.1z" />
  </svg>
)
export default ChevronUp
