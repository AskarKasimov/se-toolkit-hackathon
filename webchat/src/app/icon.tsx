import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
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
          background: '#4f46e5', // indigo-600
          borderRadius: '20%',
        }}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20" />
          <path d="M6 8h12" />
          <path d="M10 4h4" />
          <path d="M9 14l6 4" />
        </svg>
      </div>
    ),
    { ...size }
  )
}