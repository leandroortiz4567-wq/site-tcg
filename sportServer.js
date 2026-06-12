const express = require('express');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/sports.html');
});

const apiHeaders = {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
};

app.get('/api/partidas', async (req, res) => {
  try {
    const dataFiltro = req.query.data || new Date().toISOString().split('T')[0];
    const url = `https://sportapi7.p.rapidapi.com/api/v1/sport/football/scheduled-events/${dataFiltro}`;
    const response = await axios.get(url, { headers: apiHeaders });
    const data = response.data;
    res.json(data.events || []);
  } catch (error) {
    console.error('⚠️ ERRO NO SERVIDOR:', error.response ? error.response.data : error.message);
    res.status(500).json({ erro: 'Falha ao buscar os jogos na RapidAPI.' });
  }
});

app.get('/api/jpartida/:id/jogadores', async (req, res) => {
  try {
    const eventId = req.params.id;
    const url = `https://sportapi7.p.rapidapi.com/api/v1/sport/football/event/${eventId}/lineups`;
    const response = await axios.get(url, { headers: apiHeaders });
    res.json(response.data);
  } catch (error) {
    console.error(`! Erro ao buscar jogadores para partida ${req.params.id}:`, error.menssge);
    res.status(500).json({ erro: 'Falha ao buscar a escalação.' });
  }
});
app.listen(PORT, () => {
  console.log(`⚽ Sport360 rodando em http://localhost:${PORT}`);
});