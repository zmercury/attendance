import React from 'react';

interface GradientTextProps {
  text: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text }) => {
  return (
    <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-500 via-pink-500 to-red-500 text-transparent bg-clip-text bg-300% animate-gradient">
      {text}
    </span>
  );
};

export default GradientText;