import React from 'react';

export function CameraEquipmentIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Camera Body */}
      <path d="M4 8h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2z" />
      {/* Top Prism & Shutter */}
      <path d="M8 8l1.6-3.2a1 1 0 0 1 .9-.5h3a1 1 0 0 1 .9.5L16 8" />
      <circle cx="12" cy="14" r="4" />
      <circle cx="12" cy="14" r="1.8" fill="currentColor" fillOpacity="0.25" />
      <circle cx="18" cy="11" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function LensIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Outer Lens Barrel */}
      <rect x="5" y="4" width="14" height="16" rx="2" />
      {/* Front Optical Curved Glass */}
      <ellipse cx="12" cy="6" rx="5" ry="1.5" />
      {/* Focus & Zoom Ring Ribs */}
      <line x1="5" y1="10" x2="19" y2="10" />
      <line x1="5" y1="13" x2="19" y2="13" />
      <line x1="8" y1="10" x2="8" y2="13" strokeWidth="1.2" />
      <line x1="12" y1="10" x2="12" y2="13" strokeWidth="1.2" />
      <line x1="16" y1="10" x2="16" y2="13" strokeWidth="1.2" />
      {/* Distance Window Scale */}
      <rect x="9" y="15.5" width="6" height="2" rx="0.5" strokeWidth="1.2" />
      {/* Red Ring Luxury Accent / Mount Marker */}
      <line x1="5" y1="7.5" x2="19" y2="7.5" stroke="#F5821F" strokeWidth="1.5" />
    </svg>
  );
}

export function DroneIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Central Drone Fuselage */}
      <ellipse cx="12" cy="12" rx="3.5" ry="2.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
      {/* 4 Diagonal Rotor Arms */}
      <line x1="9.5" y1="10.2" x2="5.5" y2="6.2" />
      <line x1="14.5" y1="10.2" x2="18.5" y2="6.2" />
      <line x1="9.5" y1="13.8" x2="5.5" y2="17.8" />
      <line x1="14.5" y1="13.8" x2="18.5" y2="17.8" />
      {/* 4 Propeller Spin Discs */}
      <circle cx="5" cy="5.5" r="2.5" strokeDasharray="2 1.5" />
      <circle cx="19" cy="5.5" r="2.5" strokeDasharray="2 1.5" />
      <circle cx="5" cy="18.5" r="2.5" strokeDasharray="2 1.5" />
      <circle cx="19" cy="18.5" r="2.5" strokeDasharray="2 1.5" />
      {/* Front Camera Gimbal Pod */}
      <path d="M11 14.5v2a1 1 0 0 0 1 1 1 1 0 0 0 1-1v-2" strokeWidth="1.2" />
      <circle cx="12" cy="16.5" r="0.8" fill="#F5821F" />
    </svg>
  );
}

export function LightingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Studio Softbox Diffuser / Octabox shape */}
      <polygon points="12,2 19,6 19,14 12,18 5,14 5,6" />
      {/* Softbox Grid / Light Diffusion Lines */}
      <line x1="12" y1="2" x2="12" y2="18" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      <line x1="5" y1="10" x2="19" y2="10" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
      {/* Flash Bulb Center */}
      <circle cx="12" cy="10" r="2" fill="#F5821F" stroke="none" />
      {/* Mount Bracket & Light Stand */}
      <path d="M12 18v4" strokeWidth="2" />
      <path d="M9 22h6" strokeWidth="2" />
    </svg>
  );
}

export function GimbalIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Camera Plate atop */}
      <line x1="8" y1="3" x2="16" y2="3" strokeWidth="2.5" />
      {/* Tilt & Roll Curved Gimbal Arms */}
      <path d="M12 3v3" />
      <path d="M7 6h10" />
      <path d="M17 6v6a5 5 0 0 1-10 0V8" />
      {/* Pan Motor Disc */}
      <rect x="10" y="14" width="4" height="2" rx="0.5" fill="currentColor" />
      {/* Ergonomic Hand Grip Battery Stick */}
      <rect x="10.5" y="16" width="3" height="6.5" rx="1" fill="currentColor" fillOpacity="0.25" />
      {/* Joystick / Trigger */}
      <circle cx="12" cy="18" r="0.75" fill="#F5821F" />
    </svg>
  );
}

export function CameraBagIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Backpack / Hardcase Outline */}
      <rect x="4" y="6" width="16" height="15" rx="3" />
      {/* Reinforced Top Carry Handle */}
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      {/* Front Lens Compartment Flap */}
      <path d="M4 12h16" />
      {/* Dual Buckles / Straps */}
      <line x1="8" y1="9" x2="8" y2="15" strokeWidth="1.5" />
      <line x1="16" y1="9" x2="16" y2="15" strokeWidth="1.5" />
      <rect x="7" y="11.5" width="2" height="1.5" rx="0.3" fill="#F5821F" stroke="none" />
      <rect x="15" y="11.5" width="2" height="1.5" rx="0.3" fill="#F5821F" stroke="none" />
    </svg>
  );
}

export function MemoryCardIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* SD Card Outer with Cut Corner */}
      <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      {/* Gold Contact Pins */}
      <line x1="8" y1="6" x2="8" y2="9" strokeWidth="1.5" stroke="#F5821F" />
      <line x1="11" y1="6" x2="11" y2="9" strokeWidth="1.5" stroke="#F5821F" />
      <line x1="14" y1="7" x2="14" y2="9" strokeWidth="1.5" stroke="#F5821F" />
      <line x1="16.5" y1="8" x2="16.5" y2="9" strokeWidth="1.5" stroke="#F5821F" />
      {/* Write Protect Lock Notch */}
      <rect x="4" y="8" width="1.5" height="2" rx="0.3" fill="currentColor" />
      {/* Speed Label Area */}
      <rect x="7.5" y="13" width="9" height="5" rx="1" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
      <text x="12" y="16.8" fontSize="3.5" fontWeight="bold" textAnchor="middle" fill="currentColor" stroke="none">SD</text>
    </svg>
  );
}

export function StudioGearIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Heavy C-Stand Center Column */}
      <line x1="12" y1="3" x2="12" y2="19" strokeWidth="2" />
      {/* Gobo Grip Head & Extension Boom Arm */}
      <circle cx="12" cy="7" r="1.5" fill="#F5821F" stroke="none" />
      <line x1="6" y1="5" x2="18" y2="9" strokeWidth="2" />
      {/* Studio Reflector Disc on Boom */}
      <ellipse cx="5.5" cy="4.8" rx="2" ry="3" transform="rotate(-30 5.5 4.8)" stroke="#F5821F" />
      {/* Heavy Turtle Base 3 Legs */}
      <line x1="12" y1="19" x2="4" y2="22" strokeWidth="2.2" />
      <line x1="12" y1="19" x2="12" y2="22.5" strokeWidth="2.2" />
      <line x1="12" y1="19" x2="20" y2="22" strokeWidth="2.2" />
    </svg>
  );
}

export function AudioMicIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Shotgun / Broadcast Capsule */}
      <rect x="9" y="3" width="6" height="11" rx="3" />
      {/* Mic Windscreen Acoustic Grille */}
      <line x1="10.5" y1="6" x2="13.5" y2="6" strokeWidth="1.2" />
      <line x1="10.5" y1="8" x2="13.5" y2="8" strokeWidth="1.2" />
      <line x1="10.5" y1="10" x2="13.5" y2="10" strokeWidth="1.2" />
      {/* Shockmount / Cradle */}
      <path d="M6 10v1a6 6 0 0 0 12 0v-1" />
      {/* Stand Stem & Base */}
      <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2" />
      <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2" />
      <circle cx="12" cy="17" r="1" fill="#F5821F" stroke="none" />
    </svg>
  );
}
