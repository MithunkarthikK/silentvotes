import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-toastify';
import PollResultSkeleton from '../components/PollResultSkeleton';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../firebase';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PollResults() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'polls'));
      const pollsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          options: data.options.map(opt => opt.text),
          votes: data.options.map(opt => opt.votes || 0),
        };
      });
      setPolls(pollsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch poll results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10 px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-700 mb-12 tracking-tight">
        📊 Poll Insights & Results
      </h2>

      {loading ? (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <PollResultSkeleton key={i} />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No polls have been created yet.
        </p>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {polls.map(poll => {
            const totalVotes = poll.votes.reduce((a, b) => a + b, 0);
            return (
              <div
                key={poll.id}
                className="bg-white rounded-3xl shadow-xl p-6 hover:shadow-2xl transition duration-300 border border-indigo-100"
              >
                <h3 className="text-xl md:text-2xl font-bold text-indigo-700 mb-4">
                  {poll.title}
                </h3>

                <div className="relative h-56 md:h-64 mb-6">
                  <Pie
                    data={{
                      labels: poll.options,
                      datasets: [
                        {
                          data: poll.votes,
                          backgroundColor: [
                            '#4F46E5',
                            '#F59E0B',
                            '#10B981',
                            '#EF4444',
                            '#8B5CF6',
                            '#0EA5E9',
                            '#F43F5E',
                            '#22C55E',
                          ],
                          borderColor: '#fff',
                          borderWidth: 2,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: { display: true, position: 'bottom' },
                        tooltip: {
                          callbacks: {
                            label: (context) => {
                              const count = context.parsed;
                              const percent = totalVotes
                                ? ((count / totalVotes) * 100).toFixed(1)
                                : 0;
                              return `${context.label}: ${count} votes (${percent}%)`;
                            },
                          },
                        },
                      },
                      maintainAspectRatio: false,
                    }}
                  />
                </div>

                <ul className="space-y-3">
                  {poll.options.map((option, index) => {
                    const percent = totalVotes
                      ? ((poll.votes[index] / totalVotes) * 100).toFixed(1)
                      : 0;
                    return (
                      <li key={index} className="flex flex-col">
                        <div className="flex justify-between text-gray-700 font-medium mb-1">
                          <span>{option}</span>
                          <span className="text-indigo-600 font-semibold">
                            {poll.votes[index]} votes ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-indigo-100 h-3 rounded-full">
                          <div
                            className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
