import React, { useEffect, useState } from 'react';
import PlaybackControls from './PlaybackControls';

function App() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null); // Track the current group
  const [groupVolume, setGroupVolume] = useState(50); // Track the group volume

  const fetchDevices = () => {
    fetch('http://localhost:5000/devices')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data);
        setDevices(data);
        const initialGroup = data.find(device => device.state.playbackState === 'PLAYING')?.group || data[0]?.group;
        setCurrentGroup(initialGroup);
        const groupDevices = data.filter(device => device.group === initialGroup);
        if (groupDevices.length > 0) {
          setGroupVolume(groupDevices[0].volume);
        }
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
        setError(error);
      });
  };

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  const handleControl = (group, action) => {
    fetch(`http://localhost:5000/control/${group}/${action}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) });
        }
      })
      .catch(error => {
        console.error('Error performing action:', error);
        alert(`Error performing action: ${error.message}`);
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

  const handleGroupVolumeChange = (group, volume) => {
    const groupDevices = devices.filter(device => device.group === group);
    groupDevices.forEach(device => handleVolumeChange(device.uuid, volume));
    setGroupVolume(volume);
  };

  const nowPlaying = devices.find(device => device.group === currentGroup)?.nowPlaying;

  return (
    <div>
      <h1>Sonos Devices</h1>
      {error && <p>Error: {error.message}</p>}
      <ul>
        {devices.map((device, index) => (
          <li key={index} onClick={() => setCurrentGroup(device.group)} style={{ cursor: 'pointer', background: device.group === currentGroup ? 'lightgray' : 'white' }}>
            <p>Room: {device.roomName}</p>
            <p>Coordinator: {device.coordinator ? 'Yes' : 'No'}</p>
            <p>Volume: {device.volume}</p>
            <input
              type="range"
              min="0"
              max="100"
              value={device.volume}
              onChange={(e) => handleVolumeChange(device.uuid, e.target.value)}
            />
          </li>
        ))}
      </ul>
      {currentGroup && (
        <PlaybackControls
          uuid={currentGroup}
          handleControl={handleControl}
          handleVolumeChange={handleGroupVolumeChange}
          initialVolume={groupVolume}
          nowPlaying={nowPlaying}
        />
      )}
    </div>
  );
}

export default App;