import React from 'react';

export const MessageIcon: React.FC<{className: string}> = ({className}) => {
  return (
    <svg
      enableBackground="new 0 0 50 50"
      height="60px"
      id="Layer_1"
      version="1.1"
      viewBox="10 2 30 48"
      strokeWidth="3"
      width="50px"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="none" />
      <polygon
        fill="none"
        points="  45,5 5,22.201 20.195,29.799 27.805,45 "
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="3"
      />
      <line
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="3"
        x1="20.633"
        x2="43.639"
        y1="29.367"
        y2="6.361"
      />
    </svg>
  );
};
