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

For HLS streaming (`.m3u8`), install `hls.js` as well:

```bash
npm install hls.js
```

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

#### `useAudio`

Core audio playback, volume, playback rate, keyboard shortcuts. See [Quick Start](#go-headless) for usage.

#### `usePlaylist`

Extends `useAudio` with playlist management and repeat modes (`none`, `one`, `all`).

```tsx
import { usePlaylist } from '@pozalabs/pori';

const playlist = [
  { id: '1', src: '/audio/track-01.mp3' },
  { id: '2', src: '/audio/track-02.mp3' },
];

function Player() {
  const { isPlaying, togglePlayPause, playNextAudio } = usePlaylist({ playlist });
  return <button onClick={() => playNextAudio()}>Next</button>;
}
```

#### `useWaveform`

Audio visualization with Canvas/SVG rendering and interactive controls.

```tsx
import { useWaveform } from '@pozalabs/pori';

function WaveformPlayer() {
  const { waveform, isPlaying, play, pause } = useWaveform({ src: '/audio.mp3' });
  return <div ref={(el) => el && waveform && el.appendChild(waveform)} />;
}
```

### Components

#### `AudioPlayer`

Compound component with Provider and composable sub-components. See [Quick Start](#compose-an-audio-player) for usage.

- `AudioPlayer.Provider` - Provides audio player state and controls
- `AudioPlayer.Playlist` - Renders playlist items
- `AudioPlayer.CurrentTime` - Displays current playback time
- `AudioPlayer.Duration` - Displays total duration
- `AudioPlayer.ProgressBar` - Playback position slider
- `AudioPlayer.VolumeProgressBar` - Volume level slider
- `AudioPlayer.PlayButton` - Starts playback
- `AudioPlayer.PauseButton` - Pauses playback
- `AudioPlayer.PlayPauseButton` - Toggles play/pause
- `AudioPlayer.StopButton` - Stops and resets playback
- `AudioPlayer.ShiftForwardButton` - Advances playback by time shift
- `AudioPlayer.ShiftBackwardButton` - Rewinds playback by time shift
- `AudioPlayer.SkipStartButton` - Restarts or skips to previous
- `AudioPlayer.SkipEndButton` - Skips to next
- `AudioPlayer.RepeatButton` - Cycles repeat mode
- `AudioPlayer.VolumeButton` - Toggles mute

#### `Waveform`

Standalone waveform visualization component.

```tsx
import { useRef } from 'react';
import { Waveform } from '@pozalabs/pori';
import type { WaveformHandles } from '@pozalabs/pori';

function Player() {
  const ref = useRef<WaveformHandles>(null);
  return <Waveform ref={ref} src="/audio.mp3" />;
}
```

#### `Slider`

General-purpose slider for building custom progress/volume bars.

```tsx
import { useState } from 'react';
import { Slider } from '@pozalabs/pori';

function VolumeControl() {
  const [volume, setVolume] = useState(50);
  return <Slider value={volume} onChange={setVolume} />;
}
```

### Utilities

#### `fetchAudio`

Chunked parallel download with retry.

```ts
import { fetchAudio } from '@pozalabs/pori';

const audioBuffer = await fetchAudio({ src: '/audio.mp3' });
```

#### `getAudioFileInformation`

Retrieves audio file metadata (type, size) via a HEAD request.

## Development

```bash
bun dev            # Dev server (port 3000)
bun run build      # Build with tsup
bun run test       # Run tests
bun run lint       # Lint
```

## License

[MIT](./LICENSE)
