import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0c0b09',
          borderRadius: 36,
          border: '6px solid #F5821F',
          padding: 16,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F5821F',
            width: 80,
            height: 80,
            borderRadius: 20,
            marginBottom: 8,
          }}
        >
          <span
            style={{
              color: '#000000',
              fontSize: 42,
              fontWeight: 900,
              fontFamily: 'sans-serif',
            }}
          >
            MI
          </span>
        </div>
        <span
          style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}
        >
          King&apos;s
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
