import React from 'react';

function PlaybackControls({ uuid, handleControl }) {
  return (
    <div>
      <button onClick={() => handleControl(uuid, 'play')}>Play</button>
      <button onClick={() => handleControl(uuid, 'pause')}>Pause</button>
      <button onClick={() => handleControl(uuid, 'previous')}>Previous</button>
      <button onClick={() => handleControl(uuid, 'next')}>Next</button>
    </div>
  );
}

export default PlaybackControls;