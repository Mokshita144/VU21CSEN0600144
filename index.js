const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const WINDOW_SIZE = 10;
const API_BASE_URL = 'http://localhost:3000'; 

let numbers = [];

app.use(express.json());

async function fetchNumbers(numberid) {
  try {
    const response = await axios.get(`${API_BASE_URL}/numbers/${numberid}`, {
      timeout: 500,
      headers: {
        'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzI0NzM5Nzg1LCJpYXQiOjE3MjQ3Mzk0ODUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImE1MjQ5MzU0LWUyZDItNGE1Ni05ODU0LTE0MDNlNTg2ZmVlYyIsInN1YiI6Im11bGxhcHVkaW1va3NoaXRhMzczN0BnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJHSVRBTSIsImNsaWVudElEIjoiYTUyNDkzNTQtZTJkMi00YTU2LTk4NTQtMTQwM2U1ODZmZWVjIiwiY2xpZW50U2VjcmV0IjoiZ3BEWUVTbnR3TVZZWnRydSIsIm93bmVyTmFtZSI6Ik1va3NoaXRoYSIsIm93bmVyRW1haWwiOiJtdWxsYXB1ZGltb2tzaGl0YTM3MzdAZ21haWwuY29tIiwicm9sbE5vIjoiVlUyMUNTRU4wNjAwMTQ0In0.p7oV591G06RhtctT72xpgf-umVSCuZ1NXWG_tCG2MbU"
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    return null;
  }
}

function calculateAverage(nums) {
  if (nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  return parseFloat((sum / nums.length).toFixed(2));
}

app.get('/numbers/:numberid', async (req, res) => {
  const numberid = req.params.numberid;
  const newNumbers = await fetchNumbers(numberid);

  if (!newNumbers) {
    return res.status(500).json({ error: 'Failed to fetch numbers' });
  }

  const uniqueNumbers = [...new Set([...numbers, ...newNumbers])];
  
  if (uniqueNumbers.length > WINDOW_SIZE) {
    uniqueNumbers.splice(0, uniqueNumbers.length - WINDOW_SIZE);
  }

  const avg = calculateAverage(uniqueNumbers);

  const response = {
    windowPrevState: numbers,
    windowCurrState: uniqueNumbers,
    numbers: newNumbers,
    avg: avg
  };

  numbers = uniqueNumbers;

  res.json(response);
});

app.listen(port, () => {
  console.log(`Average Calculator microservice listening at http://localhost:${port}`);
});
