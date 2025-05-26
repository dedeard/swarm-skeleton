import type { Meta, StoryObj } from '@storybook/react'
import MarkdownRenderer from './MarkdownRenderer'

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'MarkdownProcessor/MarkdownRenderer',
  component: MarkdownRenderer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive markdown renderer that supports custom blocks including video blocks with vidstack.io.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      description: 'Markdown content with support for custom blocks',
      control: { type: 'text' },
    },
    className: {
      description: 'Additional CSS classes',
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
const samplePosterUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg'

export const BasicVideoBlock: Story = {
  args: {
    content: `# Video Block Demo

Here's a basic video block:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Sample video demonstration","additional":{"autoplay":false,"controls":true,"width":"640","height":"360"}}}!#/block#!

This video block demonstrates the basic functionality of the video player.`,
  },
}

export const VideoWithPoster: Story = {
  args: {
    content: `# Video with Poster Image

This video includes a poster image that displays before playback:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Video with poster image","additional":{"autoplay":false,"controls":true,"width":"640","height":"360","poster":"${samplePosterUrl}"}}}!#/block#!

The poster image provides a preview of the video content.`,
  },
}

export const ResponsiveVideo: Story = {
  args: {
    content: `# Responsive Video Player

This video player adapts to different screen sizes:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Responsive video player","additional":{"autoplay":false,"controls":true,"width":"100%","height":"auto"}}}!#/block#!

The video will scale to fit the container width while maintaining aspect ratio.`,
  },
}

export const AutoplayMutedVideo: Story = {
  args: {
    content: `# Autoplay Video (Muted)

This video starts playing automatically but is muted to comply with browser policies:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Autoplay muted video","additional":{"autoplay":true,"controls":true,"width":"640","height":"360","muted":true}}}!#/block#!

**Note:** Most browsers require videos to be muted for autoplay to work.`,
  },
}

export const MultipleVideos: Story = {
  args: {
    content: `# Multiple Video Blocks

You can include multiple video blocks in the same document:

## First Video - Standard Configuration

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"First video","additional":{"autoplay":false,"controls":true,"width":"640","height":"360"}}}!#/block#!

## Second Video - Small Size

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Second video","additional":{"autoplay":false,"controls":true,"width":"320","height":"180"}}}!#/block#!

## Third Video - With Poster

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Third video","additional":{"autoplay":false,"controls":true,"width":"640","height":"360","poster":"${samplePosterUrl}"}}}!#/block#!

Each video can have its own configuration and settings.`,
  },
}

export const MixedContent: Story = {
  args: {
    content: `# Mixed Content with Video Blocks

This demonstrates how video blocks work alongside other markdown content.

## Introduction

Here's some regular markdown content with **bold text**, *italic text*, and [links](https://example.com).

### Code Example

\`\`\`javascript
const videoConfig = {
  type: "video",
  content: {
    src: "video.mp4",
    alt: "Video description",
    additional: {
      controls: true,
      autoplay: false
    }
  }
}
\`\`\`

### Video Demonstration

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Mixed content video","additional":{"autoplay":false,"controls":true,"width":"640","height":"360","poster":"${samplePosterUrl}"}}}!#/block#!

### Features List

- ✅ Video playback with controls
- ✅ Responsive design
- ✅ Poster image support
- ✅ Autoplay (when muted)
- ✅ Accessibility features
- ✅ Multiple video formats

> **Note:** The video player is powered by vidstack.io, providing a modern and accessible video experience.

### Table Example

| Feature | Supported | Notes |
|---------|-----------|-------|
| MP4 | ✅ | Most common format |
| WebM | ✅ | Modern web format |
| Controls | ✅ | Customizable |
| Autoplay | ✅ | Requires muted |`,
  },
}

export const MinimalVideoConfig: Story = {
  args: {
    content: `# Minimal Video Configuration

This shows the simplest possible video block configuration:

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Minimal video"}}!#/block#!

When no additional configuration is provided, the video uses sensible defaults:
- Controls enabled
- No autoplay
- 100% width
- Auto height`,
  },
}

export const VideoBlockFormat: Story = {
  args: {
    content: `# Video Block Format Documentation

The video block format follows this structure:

\`\`\`json
{
  "type": "video",
  "content": {
    "src": "path/to/video.mp4",
    "alt": "Video description for accessibility",
    "additional": {
      "autoplay": false,
      "controls": true,
      "width": "640",
      "height": "360",
      "poster": "path/to/poster.jpg",
      "muted": false,
      "loop": false,
      "preload": "metadata"
    }
  }
}
\`\`\`

## Example Implementation

!#block#!{"type":"video","content":{"src":"${sampleVideoUrl}","alt":"Format demonstration video","additional":{"autoplay":false,"controls":true,"width":"640","height":"360","poster":"${samplePosterUrl}","preload":"metadata"}}}!#/block#!

## Available Options

- **src** (required): Video file URL
- **alt** (optional): Accessibility description
- **autoplay** (optional): Auto-start playback (default: false)
- **controls** (optional): Show player controls (default: true)
- **width** (optional): Player width (default: "100%")
- **height** (optional): Player height (default: "auto")
- **poster** (optional): Poster image URL
- **muted** (optional): Start muted (default: false)
- **loop** (optional): Loop playback (default: false)
- **preload** (optional): Preload strategy (default: "metadata")`,
  },
}
