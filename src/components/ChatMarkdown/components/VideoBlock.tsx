import { MediaPlayer, MediaProvider } from '@vidstack/react'
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import React from 'react'
import { VideoBlockData } from '../types'

interface VideoBlockProps {
  blockData: VideoBlockData
}

const VideoBlock: React.FC<VideoBlockProps> = ({ blockData }) => {
  const { content } = blockData
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
