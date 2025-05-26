import type { Meta, StoryObj } from '@storybook/react'
import { VideoBlockData } from '../types'
import VideoBlock from './VideoBlock'

const meta: Meta<typeof VideoBlock> = {
  title: 'ChatMarkdown/VideoBlock',
  component: VideoBlock,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A video player component using vidstack.io that supports various video formats and configurations.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    blockData: {
      description: 'Video block data containing source and configuration',
      control: { type: 'object' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Sample video URLs for demonstration
const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const samplePosterUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'

export const Default: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Big Buck Bunny sample video',
        additional: {
          controls: true,
          autoplay: false,
          width: '640',
          height: '360',
        },
      },
    } as VideoBlockData,
  },
}

export const WithPoster: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Video with poster image',
        additional: {
          controls: true,
          autoplay: false,
          poster: samplePosterUrl,
          width: '640',
          height: '360',
        },
      },
    } as VideoBlockData,
  },
}

export const AutoplayMuted: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Autoplay video (muted)',
        additional: {
          controls: true,
          autoplay: true,
          muted: true,
          width: '640',
          height: '360',
        },
      },
    } as VideoBlockData,
  },
}

export const NoControls: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Video without controls',
        additional: {
          controls: false,
          autoplay: false,
          width: '640',
          height: '360',
        },
      },
    } as VideoBlockData,
  },
}

export const ResponsiveWidth: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Responsive width video',
        additional: {
          controls: true,
          autoplay: false,
          width: '100%',
          height: 'auto',
        },
      },
    } as VideoBlockData,
  },
}

export const SmallSize: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Small video player',
        additional: {
          controls: true,
          autoplay: false,
          width: '320',
          height: '180',
        },
      },
    } as VideoBlockData,
  },
}

export const Loop: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Looping video',
        additional: {
          controls: true,
          autoplay: false,
          loop: true,
          width: '640',
          height: '360',
        },
      },
    } as VideoBlockData,
  },
}

export const MinimalConfig: Story = {
  args: {
    blockData: {
      type: 'video',
      content: {
        src: sampleVideoUrl,
        alt: 'Minimal configuration video',
      },
    } as VideoBlockData,
  },
}
