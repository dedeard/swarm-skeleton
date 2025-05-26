# Markdown Processor with Video Block Support

This markdown processor supports custom blocks including video blocks powered by vidstack.io.

## Features

- **Standard Markdown**: Full support for standard markdown syntax
- **Custom Blocks**: Extensible custom block system
- **Video Blocks**: Rich video player with vidstack.io
- **HTML Blocks**: Raw HTML content support
- **Nested Markdown**: Recursive markdown processing

## Video Block Usage

### Basic Video Block

```markdown
!#block#!{"type":"video","content":{"src":"video.mp4","alt":"Video description"}}!#/block#!
```

### Full Configuration

```markdown
!#block#!{"type":"video","content":{"src":"video.mp4","alt":"Video description","additional":{"autoplay":false,"controls":true,"width":"640","height":"360","poster":"poster.jpg","muted":false,"loop":false,"preload":"metadata"}}}!#/block#!
```

## Video Block Options

| Option     | Type          | Default        | Description               |
| ---------- | ------------- | -------------- | ------------------------- |
| `src`      | string        | required       | Video file URL            |
| `alt`      | string        | "Video player" | Accessibility description |
| `autoplay` | boolean       | false          | Auto-start playback       |
| `controls` | boolean       | true           | Show player controls      |
| `width`    | string/number | "100%"         | Player width              |
| `height`   | string/number | "auto"         | Player height             |
| `poster`   | string        | undefined      | Poster image URL          |
| `muted`    | boolean       | false          | Start muted               |
| `loop`     | boolean       | false          | Loop playback             |
| `preload`  | string        | "metadata"     | Preload strategy          |

## Examples

### Responsive Video

```markdown
!#block#!{"type":"video","content":{"src":"video.mp4","alt":"Responsive video","additional":{"width":"100%","height":"auto"}}}!#/block#!
```

### Autoplay Video (Muted)

```markdown
!#block#!{"type":"video","content":{"src":"video.mp4","alt":"Autoplay video","additional":{"autoplay":true,"muted":true}}}!#/block#!
```

### Video with Poster

```markdown
!#block#!{"type":"video","content":{"src":"video.mp4","alt":"Video with poster","additional":{"poster":"poster.jpg"}}}!#/block#!
```

## Supported Video Formats

- MP4 (H.264)
- WebM (VP8/VP9)
- OGV (Theora)
- HLS (m3u8)
- DASH (mpd)

## Browser Support

The video player is built with vidstack.io and supports:

- Chrome 63+
- Firefox 67+
- Safari 12+
- Edge 79+

## Accessibility

- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and descriptions
- Focus management
- High contrast mode support

## Development

### Running Storybook

```bash
npm run storybook
```

### Testing Video Blocks

The Storybook includes comprehensive examples of video block usage:

- Basic video blocks
- Configuration options
- Responsive layouts
- Multiple videos
- Mixed content

### Custom Styling

Video blocks can be styled using CSS:

```css
.video-block-container {
  /* Container styles */
}

.video-block-player {
  /* Player styles */
}
```

## Architecture

The video block system consists of:

1. **VideoBlock Component**: React component using vidstack.io
2. **Type Definitions**: TypeScript interfaces for video block data
3. **Markdown Integration**: Custom block parser and renderer
4. **Storybook Stories**: Documentation and examples

## Performance

- Lazy loading of video content
- Efficient rendering with React.memo
- Optimized for multiple videos per page
- Minimal bundle size impact
