import React from "react";

interface BackIconProps {
  className?: string;
  strokeWidth?: number;
}

const BackIcon: React.FC<BackIconProps> = ({
  className = "size-6",
  strokeWidth = 2,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
};

export default BackIcon;
