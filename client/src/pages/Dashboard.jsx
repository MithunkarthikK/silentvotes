import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import app from '../firebase';
import PollCardSkeleton from '../components/PollCardSkeleton';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);
  const auth = getAuth(app);

  // Fetch polls from Firestore
  const fetchPolls = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'polls'));
      const pollsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPolls(pollsData);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error('You must be logged in to vote');
        return;
      }

      const poll = polls.find(p => p.id === pollId);
      if (!poll) return;

      // Check if user already voted
      if (poll.votedUsers?.includes(user.uid)) {
        toast.info('You have already voted for this poll');
        return;
      }

      // Update votes for the selected option
      const updatedOptions = poll.options.map((opt, i) =>
        i === optionIndex ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
      );

      const pollRef = doc(db, 'polls', pollId);
      await updateDoc(pollRef, {
        options: updatedOptions,
        votedUsers: arrayUnion(user.uid), // track users who voted
      });

      toast.success('Vote recorded successfully');
      fetchPolls(); // Refresh polls
    } catch (err) {
      console.error(err);
      toast.error('Error voting');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
        🗳️ Active Polls
      </h2>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <PollCardSkeleton key={i} />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No polls available right now.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {polls.map(poll => {
            const user = auth.currentUser;
            const userVoted = user && poll.votedUsers?.includes(user.uid);
            return (
              <div
                key={poll.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">{poll.title}</h3>
                <div className="space-y-3">
                  {poll.options.map((opt, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between rounded-md px-4 py-2 transition
                        ${userVoted && poll.options[i].votes === Math.max(...poll.options.map(o => o.votes))
                          ? 'bg-green-100 border border-green-400'
                          : 'bg-indigo-50 hover:bg-indigo-100'}
                      `}
                    >
                      <span className="text-indigo-900 font-medium">{opt.text}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">{opt.votes || 0} votes</span>
                        {!userVoted && (
                          <button
                            onClick={() => handleVote(poll.id, i)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 text-sm rounded-md transition"
                          >
                            Vote
                          </button>
                        )}
                        {userVoted && (
                          <span className="text-green-700 font-semibold text-sm">Voted</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
