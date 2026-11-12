import React from 'react';

export const QuantumWave: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 500 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none opacity-40 ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 10 160 C 140 160, 240 60, 490 30"
        stroke="#5A74C7"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      <path
        d="M 20 165 C 150 165, 260 70, 490 45"
        stroke="#6882D6"
        strokeWidth="1.2"
        strokeOpacity="0.6"
      />
      <path
        d="M 30 170 C 160 170, 280 80, 490 60"
        stroke="#7A93E5"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <path
        d="M 40 175 C 170 175, 300 95, 490 80"
        stroke="#8290C9"
        strokeWidth="1.1"
        strokeOpacity="0.45"
      />
      <path
        d="M 50 180 C 180 180, 320 110, 490 100"
        stroke="#8499B8"
        strokeWidth="1.0"
        strokeOpacity="0.35"
      />
      <path
        d="M 60 185 C 190 185, 340 125, 490 120"
        stroke="#8499B8"
        strokeWidth="0.9"
        strokeOpacity="0.25"
      />
      <path
        d="M 70 190 C 200 190, 360 140, 490 140"
        stroke="#8499B8"
        strokeWidth="0.8"
        strokeOpacity="0.18"
      />
      <path
        d="M 80 195 C 210 195, 380 155, 490 160"
        stroke="#8499B8"
        strokeWidth="0.8"
        strokeOpacity="0.12"
      />
    </svg>
  );
};

