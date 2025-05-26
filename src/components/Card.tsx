// components/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children,className }) => {
  return (
    <div className={`bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition-shadow ${className}`} >
      {children}
    </div>
  );
};
