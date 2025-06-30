import { useEffect, useState } from 'react';
import API from '../services/api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollResults() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    API.get('/poll')
      .then(res => setPolls(res.data))
      .catch(() => toast.error('Failed to fetch poll results'));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Poll Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map((poll) => (
          <div key={poll._id} className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">{poll.question}</h3>
            <Pie
              data={{
                labels: poll.options,
                datasets: [
                  {
                    data: poll.votes,
                    backgroundColor: [
                      '#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6',
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

