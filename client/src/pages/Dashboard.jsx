import { useEffect, useState } from 'react';
import API from '../services/api';
import { toast } from 'react-toastify';
import PollCardSkeleton from '../components/PollCardSkeleton'; // ✅ Import shimmer

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    API.get('/poll')
      .then(res => setPolls(res.data))
      .catch(() => toast.error('Failed to load polls'))
      .finally(() => setLoading(false)); // ✅ Set loading to false
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">🗳️ Active Polls</h2>

      {/* Show shimmer if loading */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <PollCardSkeleton key={i} />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No polls available right now.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map(poll => (
            <div key={poll._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">{poll.question}</h3>
              <div className="space-y-3">
                {poll.options.map((opt, i) => (
                  <div key={i} className="flex items-center justify-between bg-indigo-50 rounded-md px-4 py-2">
                    <span className="text-indigo-900 font-medium">{opt}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{poll.votes[i]} votes</span>
                      <button
                        onClick={() => handleVote(poll._id, i)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-sm rounded-md"
                      >
                        Vote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
