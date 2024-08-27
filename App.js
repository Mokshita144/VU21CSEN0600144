import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [numberid, setNumberid] = useState('p');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/numbers/${numberid}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Average Calculator</h1>
      <input
        type="text"
        value={numberid}
        onChange={(e) => setNumberid(e.target.value)}
      />
      <button onClick={fetchData}>Get Numbers</button>
      {data && (
        <div>
          <h2>Previous State:</h2>
          <pre>{JSON.stringify(data.windowPrevState, null, 2)}</pre>
          <h2>Current State:</h2>
          <pre>{JSON.stringify(data.windowCurrState, null, 2)}</pre>
          <h2>Numbers:</h2>
          <pre>{JSON.stringify(data.numbers, null, 2)}</pre>
          <h2>Average:</h2>
          <pre>{data.avg}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
