
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

  const renderDeviceState = (state) => {
    return Object.entries(state).map(([key, value]) => (
      <p key={key}>{key}: {typeof value === 'object' ? JSON.stringify(value) : value}</p>
    ));
  };

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

  return (
    <div>
      <h1>Sonos Devices</h1>
      {error && <p>Error: {error.message}</p>}
      <ul>
        {devices.map((device, index) => (
          <li key={index}>
            <p>{device.roomName}</p>
            <p>{device.volume}</p>
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