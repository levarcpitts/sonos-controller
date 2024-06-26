
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
    uuid: player.uuid,
    state: player.state,
    volume: player.state.volume,
  }));
  res.json(devices);
});

app.post('/control/:uuid/:action', (req, res) => {
    const { uuid, action } = req.params;
    const player = discovery.getPlayerByUUID(uuid);
  
    if (!player) {
      return res.status(404).send('Player not found');
    }
  
    switch (action) {
      case 'play':
        player.play();
        break;
      case 'pause':
        player.pause();
        break;
      case 'next':
        player.nextTrack();
        break;
      case 'previous':
        player.previousTrack();
        break;
      default:
        return res.status(400).send('Unknown action');
    }
  
    res.send('OK');
  });
  
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
