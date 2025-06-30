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
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-10 tracking-tight">
        Poll Insights & Results
      </h2>

      {polls.length === 0 && (
        <p className="text-center text-gray-600 text-lg">No polls have been created yet.</p>
      )}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {polls.map((poll) => (
          <div
            key={poll._id}
            className="bg-white rounded-2xl shadow-lg p-6 hover:ring-2 ring-indigo-300 transition duration-200"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-3">{poll.question}</h3>

            <div className="relative h-56 mb-4">
              <Pie
                data={{
                  labels: poll.options,
                  datasets: [
                    {
                      data: poll.votes,
                      backgroundColor: [
                        '#4F46E5', '#F59E0B', '#10B981', '#EF4444',
                        '#8B5CF6', '#0EA5E9', '#F43F5E', '#22C55E'
                      ],
                      borderColor: '#fff',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                }}
              />
            </div>

            <ul className="space-y-2 text-sm text-gray-700">
              {poll.options.map((option, index) => {
                const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
                const percent = totalVotes
                  ? ((poll.votes[index] / totalVotes) * 100).toFixed(1)
                  : 0;
                return (
                  <li key={index} className="flex justify-between border-b pb-1">
                    <span>{option}</span>
                    <span className="text-indigo-600 font-semibold">{poll.votes[index]} votes ({percent}%)</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
