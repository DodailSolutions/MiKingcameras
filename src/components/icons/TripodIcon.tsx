import React from 'react';

export function TripodIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Camera Mount Plate & Quick Release */}
      <rect x="7" y="2" width="10" height="2.5" rx="0.5" fill="currentColor" fillOpacity="0.2" />
      {/* Pan & Tilt Head / Collar */}
      <circle cx="12" cy="7" r="2.5" />
      {/* Central Stem */}
      <line x1="12" y1="9.5" x2="12" y2="12" />
      {/* Three Tripod Legs Extending Downward */}
      <line x1="12" y1="12" x2="12" y2="22" strokeWidth="2.2" />
      <line x1="12" y1="12" x2="5" y2="22" strokeWidth="2.2" />
      <line x1="12" y1="12" x2="19" y2="22" strokeWidth="2.2" />
      {/* Mid-Level Leg Spreader Brace */}
      <path d="M7.8 17h8.4" strokeWidth="1.6" />
      {/* Rubber Grip Feet */}
      <circle cx="5" cy="22" r="1" fill="currentColor" />
      <circle cx="12" cy="22" r="1" fill="currentColor" />
      <circle cx="19" cy="22" r="1" fill="currentColor" />
    </svg>
  );
}
