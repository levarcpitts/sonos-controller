import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PlaybackControls from './PlaybackControls';
import GroupVolumeControls from './GroupVolumeControls';

function App() {
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [currentGroup, setCurrentGroup] = useState(null); // Track the current group
  const [groupVolume, setGroupVolume] = useState(50); // Track the group volume
  const [isGroupVolumeControlsVisible, setIsGroupVolumeControlsVisible] = useState(false); // State to manage visibility

  const dummyDevices = [
    {
      roomName: 'Living Room',
      coordinator: true,
      state: { playbackState: 'PAUSED', volume: 30, currentTrack: { title: 'Track 1', artist: 'Artist 1', album: 'Album 1', albumArtUri: 'https://example.com/album1.jpg' }},
      uuid: 'uuid1',
      group: 'group1',
    },
    {
      roomName: 'Bedroom',
      coordinator: false,
      state: { playbackState: 'PLAYING', volume: 40, currentTrack: { title: 'Track 2', artist: 'Artist 2', album: 'Album 2', albumArtUri: 'https://example.com/album2.jpg' }},
      uuid: 'uuid2',
      group: 'group1',
    },
    {
      roomName: 'Kitchen',
      coordinator: false,
      state: { playbackState: 'STOPPED', volume: 50, currentTrack: { title: 'Track 3', artist: 'Artist 3', album: 'Album 3', albumArtUri: 'https://example.com/album3.jpg' }},
      uuid: 'uuid3',
      group: 'group2',
    },
  ];

  const fetchDevices = () => {
    try {
      setDevices(dummyDevices);
      const initialGroup = dummyDevices.find(device => device.state.playbackState === 'PLAYING')?.group || dummyDevices[0]?.group;
      setCurrentGroup(initialGroup);
      const groupDevices = dummyDevices.filter(device => device.group === initialGroup);
      if (groupDevices.length > 0) {
        setGroupVolume(groupDevices[0].state.volume);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleControl = (group, action) => {
    console.log(`Control action: ${action} for group: ${group}`);
  };

  const handleVolumeChange = (uuid, volume) => {
    setDevices((prevDevices) => 
      prevDevices.map((device) => 
        device.uuid === uuid ? { ...device, state: { ...device.state, volume: parseInt(volume) } } : device
      )
    );
    console.log(`Volume change: ${volume} for UUID: ${uuid}`);
  };

  const handleGroupVolumeChange = (group, volume) => {
    const groupDevices = devices.filter(device => device.group === group);
    groupDevices.forEach(device => handleVolumeChange(device.uuid, volume));
    setGroupVolume(volume);
  };

  const nowPlaying = devices.find(device => device.group === currentGroup)?.state.currentTrack;

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <div>
        <h1>Sonos Devices</h1>
        {error && <p>Error: {error.message}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          {currentGroup && (
            <PlaybackControls
              uuid={currentGroup}
              handleControl={handleControl}
              handleVolumeChange={handleGroupVolumeChange}
              initialVolume={groupVolume}
              nowPlaying={nowPlaying}
              toggleGroupVolumeControls={() => setIsGroupVolumeControlsVisible(prev => !prev)}
            />
          )}
          {isGroupVolumeControlsVisible && (
            <GroupVolumeControls
              devices={devices}
              currentGroup={currentGroup}
              setCurrentGroup={setCurrentGroup}
              handleVolumeChange={handleVolumeChange}
            />
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
