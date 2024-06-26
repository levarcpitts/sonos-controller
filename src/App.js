import React, { useEffect, useState } from 'react';

function App() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/devices')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setDevices(data);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
        setError(error);
      });
  }, []);

  const handleControl = (uuid, action) => {
    fetch(`http://localhost:5000/control/${uuid}/${action}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to perform action');
        }
      })
      .catch(error => {
        console.error('Error performing action:', error);
      });
  };

  const handleVolumeChange = (uuid, volume) => {
    setDevices((prevDevices) => 
      prevDevices.map((device) => 
        device.uuid === uuid ? { ...device, volume: parseInt(volume) } : device
      )
    );

    fetch(`http://localhost:5000/volume/${uuid}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ volume: parseInt(volume) })
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
      })
      .catch(error => {
        console.error('Error setting volume:', error);
        alert(`Error setting volume: ${error.message}`);
      });
  };

  return (
    <div>
      <h1>Sonos Devices</h1>
      {error && <p>Error: {error.message}</p>}
      <ul>
        {devices.map((device, index) => (
          <li key={index}>
            <p>{device.roomName}</p>
            <p>Volume: {device.volume}</p> {/* Display volume */}
            <input
              type="range"
              min="0"
              max="100"
              value={device.volume}
              onChange={(e) => handleVolumeChange(device.uuid, e.target.value)}
            />
            <div>
              <button onClick={() => handleControl(device.uuid, 'play')}>Play</button>
              <button onClick={() => handleControl(device.uuid, 'pause')}>Pause</button>
              <button onClick={() => handleControl(device.uuid, 'previous')}>Previous</button>
              <button onClick={() => handleControl(device.uuid, 'next')}>Next</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;