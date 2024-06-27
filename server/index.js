const express = require('express');
const SonosDiscovery = require('sonos-discovery');
const cors = require('cors');

const app = express();
const discovery = new SonosDiscovery();

app.use(cors());
app.use(express.json());

app.get('/devices', (req, res) => {
  const devices = Object.values(discovery.players).map(player => ({
    roomName: player.roomName,
    coordinator: player.coordinator,
    state: player.state,
    uuid: player.uuid,
    volume: player.state.volume,
    group: player.coordinator.uuid,
    nowPlaying: player.state.currentTrack
  }));
  res.json(devices);
});

app.post('/control/:uuid/:action', (req, res) => {
  const { uuid, action } = req.params;
  const player = discovery.getPlayerByUUID(uuid);

  console.log(`Received control request: uuid=${uuid}, action=${action}`);

  if (!player) {
    console.error('Player not found');
    return res.status(404).send('Player not found');
  }

  const targetPlayer = player.coordinator;

  try {
    switch (action) {
      case 'play':
        targetPlayer.play();
        break;
      case 'pause':
        targetPlayer.pause();
        break;
      case 'next':
        targetPlayer.nextTrack();
        break;
      case 'previous':
        targetPlayer.previousTrack();
        break;
      default:
        console.error('Unknown action');
        return res.status(400).send('Unknown action');
    }
    res.send('OK');
  } catch (error) {
    console.error('Error performing action:', error);
    res.status(500).send('Error performing action');
  }
});

app.post('/volume/:uuid', (req, res) => {
  const { uuid } = req.params;
  const { volume } = req.body;
  const player = discovery.getPlayerByUUID(uuid);

  console.log(`Received volume request: uuid=${uuid}, volume=${volume}`);

  if (!player) {
    console.error('Player not found');
    return res.status(404).send('Player not found');
  }

  const targetPlayer = player.coordinator;

  try {
    targetPlayer.setVolume(volume);
    res.send('OK');
  } catch (error) {
    console.error('Error setting volume:', error);
    res.status(500).send('Error setting volume');
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));