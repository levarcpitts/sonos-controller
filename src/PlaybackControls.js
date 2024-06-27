import React, { useState, useEffect } from 'react';

function PlaybackControls({ uuid, handleControl, handleVolumeChange, initialVolume, nowPlaying }) {
  const [volume, setVolume] = useState(initialVolume);

  useEffect(() => {
    setVolume(initialVolume);
  }, [initialVolume]);

  const handleVolumeSliderChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    handleVolumeChange(uuid, newVolume);
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
      <button onClick={() => handleControl(uuid, 'play')}>Play</button>
      <button onClick={() => handleControl(uuid, 'pause')}>Pause</button>
      <button onClick={() => handleControl(uuid, 'previous')}>Previous</button>
      <button onClick={() => handleControl(uuid, 'next')}>Next</button>
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