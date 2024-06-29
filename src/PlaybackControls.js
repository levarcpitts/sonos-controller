import React, { useState, useEffect } from 'react';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FastForwardIcon from '@material-ui/icons/FastForward';
import PauseIcon from '@material-ui/icons/Pause';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import IconButton from '@mui/material/IconButton';

function PlaybackControls({ uuid, handleControl, handleVolumeChange, initialVolume, nowPlaying }) {
  const [volume, setVolume] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setVolume(initialVolume);
  }, [initialVolume]);

  const handleVolumeSliderChange = (e) => {
    const newVolume = e.target.value;
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
    <div>
         <div>
        <h3>Now Playing</h3>
        {nowPlaying ? (
          <div>
            <img src={nowPlaying.albumArtUri} alt="Album cover" style={{ width: '100px', height: '100px' }} />
            <p>Track: {nowPlaying.title}</p>
            <p>Artist: {nowPlaying.artist}</p>
            <p>Album: {nowPlaying.album}</p>
          </div>
        ) : (
          <p>No track playing</p>
        )}
      </div>
      <FastRewindIcon onClick={() => handleControl(uuid, 'previous')}>Previous</FastRewindIcon>
      <button onClick={togglePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </button>
      <FastForwardIcon onClick={() => handleControl(uuid, 'next')}>Next</FastForwardIcon>
      <div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeSliderChange}
        />
        <p>Volume: {volume}</p>
      </div>
    </div>
  );
}

export default PlaybackControls;