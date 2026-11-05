import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0b09',
          borderRadius: 8,
          border: '1.5px solid #F5821F',
          boxShadow: '0 2px 8px rgba(245, 130, 31, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Brand Lettermark */}
          <span
            style={{
              color: '#F5821F',
              fontSize: 14,
              fontWeight: 900,
              fontFamily: 'sans-serif',
              letterSpacing: '-0.5px',
              lineHeight: 1,
            }}
          >
            MI
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
