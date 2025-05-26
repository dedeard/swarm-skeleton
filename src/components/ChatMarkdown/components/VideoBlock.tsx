import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import React from 'react'
import { VideoBlockData } from '../types'

interface VideoBlockProps {
  blockData: VideoBlockData
}

const LoadingSkeleton: React.FC<{ width: string | number; height: string | number }> = ({ width, height }) => {
  // Convert width to proper CSS value and ensure it doesn't exceed container
  const getWidth = (w: string | number) => {
    if (typeof w === 'number') return `${w}px`
    if (w === '100%') return '100%'
    if (w.endsWith('px')) return w
    if (w.endsWith('%')) return w
    return `${w}px`
  }

  // Convert height to proper CSS value with reasonable defaults
  const getHeight = (h: string | number) => {
    if (h === 'auto') return '300px'
    if (typeof h === 'number') return `${h}px`
    if (h.endsWith('px')) return h
    if (h.endsWith('%')) return h
    return `${h}px`
  }

  const skeletonStyle: React.CSSProperties = {
    width: getWidth(width),
    height: getHeight(height),
    maxWidth: '100%',
    minWidth: '200px', // Prevent too small widths
    margin: '1rem 0',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '12px',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  }

  const shimmerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
    animation: 'shimmer 1.5s infinite',
  }

  return (
    <div style={skeletonStyle} className="video-loading-skeleton">
      <div style={shimmerStyle} />
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#d0d0d0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '0',
            height: '0',
            borderLeft: '12px solid #999',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            marginLeft: '3px',
          }}
        />
      </div>
      <div
        style={{
          color: '#666',
          fontSize: '14px',
          fontWeight: '500',
          zIndex: 1,
        }}
      >
        Loading video...
      </div>
      <style>{`
        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
        .video-loading-skeleton {
          contain: layout style;
          will-change: auto;
        }
        .video-block-container {
          contain: layout;
        }
      `}</style>
    </div>
  )
}

const VideoBlock: React.FC<VideoBlockProps> = ({ blockData }) => {
  const { content, isLoading = false, isComplete = true, parseError } = blockData

  // Handle loading states
  if (isLoading || !isComplete) {
    // Try to get dimensions from incomplete data
    const additional = content?.additional || {}
    const width = additional.width || '100%'
    const height = additional.height || 'auto'

    return <LoadingSkeleton width={width} height={height} />
  }

  // Handle parse errors
  if (parseError) {
    const errorStyle: React.CSSProperties = {
      width: '100%',
      maxWidth: '640px',
      height: '200px',
      margin: '1rem 0',
      backgroundColor: '#fee',
      border: '1px solid #fcc',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '8px',
      color: '#c33',
    }

    return (
      <div style={errorStyle} className="video-block-error">
        <div style={{ fontSize: '16px', fontWeight: '500' }}>Failed to load video block</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>{parseError}</div>
      </div>
    )
  }

  // Handle missing or invalid content
  if (!content || !content.src) {
    return <LoadingSkeleton width="100%" height="auto" />
  }

  const { src, alt = 'Video player', additional = {} } = content
  const {
    autoplay = false,
    controls = true,
    width = '100%',
    height = 'auto',
    poster,
    muted = false,
    loop = false,
    preload = 'metadata',
  } = additional

  // Convert string dimensions to numbers if needed
  const playerWidth = typeof width === 'string' && width.endsWith('px') ? parseInt(width.replace('px', '')) : width
  const playerHeight = typeof height === 'string' && height.endsWith('px') ? parseInt(height.replace('px', '')) : height

  const containerStyle: React.CSSProperties = {
    width: playerWidth,
    height: playerHeight === 'auto' ? undefined : playerHeight,
    maxWidth: '100%',
    margin: '1rem 0',
  }

  return (
    <div style={containerStyle} className="video-block-container">
      <MediaPlayer
        title={alt}
        src={src}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        preload={preload}
        poster={poster}
        className="video-block-player"
      >
        <MediaProvider />
        {controls && <DefaultVideoLayout thumbnails={poster} icons={defaultLayoutIcons} />}
      </MediaPlayer>
    </div>
  )
}

export default VideoBlock
