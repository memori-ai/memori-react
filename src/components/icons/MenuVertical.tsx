import * as React from "react"
const MenuVertical = ({
    className,
    title,
    bold = false,
  }: {
    className?: string;
    title?: string;
    bold?: boolean;
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
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={bold ? 3 : 2}
      d="M13 5a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM13 12a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM13 19a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"
    />
  </svg>
)
export default MenuVertical
