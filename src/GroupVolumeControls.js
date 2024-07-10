import React from 'react';
import { Slider, Typography } from '@mui/material';
import { VolumeUp, VolumeDown } from '@mui/icons-material';
import SpeakerIcon from '@mui/icons-material/Speaker';
import './styles/GroupVolumeControls.css'


function GroupVolumeControls({ devices, currentGroup, setCurrentGroup, handleVolumeChange }) {
  return (
    <div className="group-volume-controls">
    <Typography variant="h4" className="header">Speakers</Typography>
    <ul>
      {devices.map((device, index) => (
        <li
          key={index}
          onClick={() => setCurrentGroup(device.group)}
          style={{ cursor: 'pointer', background: device.group === currentGroup ? 'lightgray' : 'white' }}
        >
        <div className="device-info">
            <SpeakerIcon />
        <Typography variant="body1" className="room-name">{device.roomName}</Typography>
        </div>
        <div className="volume-control">
        <VolumeDown />
        <Slider
                value={device.state.volume}
                onChange={(e, value) => handleVolumeChange(device.uuid, value)}
                aria-labelledby="continuous-slider"
              />
            <VolumeUp />
          </div>
        </li>
      ))}
    </ul>
    </div>
  );
}

export default GroupVolumeControls;
