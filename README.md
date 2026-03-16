# pori

A React audio library built for fast loading and flexible UI composition.

pori gives you optimized audio fetching out of the box and a layered API: use headless hooks for full control, or compose pre-built components to ship faster.

## Features

- **Optimized Audio Loading** - Adaptive chunking with parallel downloads and automatic retries
- **Headless Hooks** - `useAudio`, `usePlaylist`, `useWaveform` work independently from any UI
- **Compound Components** - Pick and arrange only the sub-components you need
- **Waveform Visualization** - Canvas and SVG renderers with line/bar variants and hover preview
- **HLS Streaming** - Automatic detection and playback for `.m3u8` sources
- **TypeScript** - Full type coverage

## Installation

```bash
npm install @pozalabs/pori
```

> Requires React 18 or later.

## Quick Start

### Compose an audio player

Wrap sub-components inside `AudioPlayer.Provider` to build the exact player you need.

```tsx
import { AudioPlayer } from '@pozalabs/pori';

const playlist = [
  { id: '1', src: '/audio/track-01.mp3' },
  { id: '2', src: '/audio/track-02.mp3' },
];

function Player() {
  return (
    <AudioPlayer.Provider playlist={playlist}>
      <AudioPlayer.PlayPauseButton />
      <AudioPlayer.ProgressBar />
      <AudioPlayer.CurrentTime format="MM:SS" />
      <AudioPlayer.Duration format="MM:SS" />
      <AudioPlayer.VolumeProgressBar />
    </AudioPlayer.Provider>
  );
}
```

### Go headless

Use hooks directly when you need a fully custom UI.

```tsx
import { useAudio } from '@pozalabs/pori';

function CustomPlayer({ src }: { src: string }) {
  const { isPlaying, currentTime, duration, togglePlayPause } = useAudio({ src });

  return (
    <div>
      <button onClick={() => togglePlayPause()}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <span>{currentTime} / {duration}</span>
    </div>
  );
}
```

## API Overview

### Hooks

- `useAudio` - Core audio playback, volume, playback rate, keyboard shortcuts
- `usePlaylist` - Extends `useAudio` with playlist management and repeat modes (`none`, `one`, `all`)
- `useWaveform` - Audio visualization with Canvas/SVG rendering and interactive controls

### Components

- `AudioPlayer` - Compound component with Provider and composable sub-components
- `Waveform` - Standalone waveform visualization component
- `Slider` - General-purpose slider for building custom progress/volume bars

### Utilities

- `fetchAudio` - Chunked parallel download with retry
- `getAudioFileInformation` - Retrieve audio file metadata (type, size)

## Development

```bash
bun dev            # Dev server (port 3000)
bun run build      # Build with tsup
bun run test       # Run tests
bun run lint       # Lint
```

## License

[MIT](./LICENSE)
