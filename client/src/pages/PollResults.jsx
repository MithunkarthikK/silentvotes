import { useEffect, useState } from 'react';
import API from '../services/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollResults() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    API.get('/poll').then(res => setPolls(res.data));
  }, []);

  return (
    <div>
      <h2>Poll Results</h2>
      {polls.map((poll, index) => (
        <div key={index}>
          <h3>{poll.question}</h3>
          <Pie
            data={{
              labels: poll.options,
              datasets: [{
                data: poll.votes,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#81C784', '#BA68C8'],
              }],
            }}
          />
        </div>
      ))}
    </div>
  );
}
