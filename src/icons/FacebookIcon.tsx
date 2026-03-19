import * as React from "react"
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      d="M17.3 9.6a1 1 0 1 0-1.6-1.2l-2.308 3.078-2.185-2.185A1 1 0 0 0 9.7 9.4l-3 4a1 1 0 0 0 1.6 1.2l2.308-3.078 2.185 2.185A1 1 0 0 0 14.3 13.6l3-4Z"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M12 23c-1.224 0-1.9-.131-3-.5l-2.106 1.053A2 2 0 0 1 4 21.763V19.5c-2.153-2.008-3-4.323-3-7.5C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11Zm-6-4.37-.636-.593C3.691 16.477 3 14.733 3 12a9 9 0 1 1 9 9c-.986 0-1.448-.089-2.364-.396l-.788-.264L6 21.764V18.63Z"
      clipRule="evenodd"
    />
  </svg>
)
export default FacebookIcon
