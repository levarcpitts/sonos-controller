import React, { useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PauseIcon from '@mui/icons-material/Pause';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import SpeakerGroupIcon from '@mui/icons-material/SpeakerGroup';
import './styles/PlaybackControls.css';

function PlaybackControls({ uuid, handleControl, handleVolumeChange, initialVolume, nowPlaying, toggleGroupVolumeControls }) {
  const [volume, setVolume] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setVolume(initialVolume);
  }, [initialVolume]);

  const handleVolumeSliderChange = (e, newVolume) => {
    setVolume(newVolume);
    handleVolumeChange(uuid, newVolume);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      handleControl(uuid, 'pause');
    } else {
      handleControl(uuid, 'play');
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="playback-controls">
      <div className="now-playing-info">
        {nowPlaying ? (
          <div className="track-info">
            <img src={nowPlaying.albumArtUri} alt="Album cover" className="album-art" />
            <div className="track-details">
              <p className="track-title">{nowPlaying.title}</p>
              <p className="track-artist">{nowPlaying.artist}</p>
            </div>
          </div>
        ) : (
          <p className="no-track">No track playing</p>
        )}
      </div>
      <div className="control-buttons">
        <IconButton onClick={() => handleControl(uuid, 'previous')}>
          <FastRewindIcon />
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={() => handleControl(uuid, 'next')}>
          <FastForwardIcon />
        </IconButton>
      </div>
      <div className="volume-control">
        <Slider value={volume} onChange={handleVolumeSliderChange} aria-labelledby="continuous-slider" />
        <SpeakerGroupIcon onClick={toggleGroupVolumeControls} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
}

export default PlaybackControls;
