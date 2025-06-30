import { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    API.get('/poll')
      .then(res => setPolls(res.data))
      .catch(() => toast.error('Failed to load polls'));
  }, []);

  const handleVote = async (pollId, index) => {
    try {
      await API.post(`/poll/vote/${pollId}`, { optionIndex: index });
      toast.success('Vote recorded');
      const updated = await API.get('/poll');
      setPolls(updated.data);
    } catch (err) {
      toast.error(err?.response?.data || 'Error voting');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Polls</h2>
      {polls.map(poll => (
        <div key={poll._id} className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">{poll.question}</h3>
          <ul className="space-y-2">
            {poll.options.map((opt, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>{opt} - {poll.votes[i]} votes</span>
                <button onClick={() => handleVote(poll._id, i)} className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">Vote</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
