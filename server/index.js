
const express = require('express');
const SonosDiscovery = require('sonos-discovery');
const cors = require('cors');

const app = express();
const discovery = new SonosDiscovery();

app.use(cors());

app.get('/devices', (req, res) => {
  const devices = Object.values(discovery.players).map(player => ({
    roomName: player.roomName,
    coordinator: player.coordinator,
    state: player.state
  }));
  res.json(devices);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
