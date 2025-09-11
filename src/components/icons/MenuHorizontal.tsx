import * as React from "react"
const MenuHorizontal = ({
    className,
    title,
    stroke,
  }: {
    className?: string;
    title?: string;
    stroke?: string;
  }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    className={className}
    aria-label={title}
  >
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
    />
  </svg>
)
export default MenuHorizontal
