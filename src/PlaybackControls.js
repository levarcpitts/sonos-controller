import React, { useState, useEffect } from 'react';

function PlaybackControls({ uuid, handleControl, handleVolumeChange, initialVolume }) {
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