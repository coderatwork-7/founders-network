import React from 'react';

export const SearchIcon: React.FC<{className: string}> = ({className}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      id="search"
      viewBox="2 -2 20 28"
    >
      <path d="M11 22C4.935 22 0 17.065 0 11S4.935 0 11 0s11 4.935 11 11-4.935 11-11 11zm0-20c-4.962 0-9 4.037-9 9s4.038 9 9 9 9-4.037 9-9-4.038-9-9-9z"></path>
      <path d="M23 24a.997.997 0 0 1-.707-.293l-4.795-4.795a1 1 0 0 1 1.415-1.414l4.794 4.795A.999.999 0 0 1 23 24z"></path>
    </svg>
  );
};
