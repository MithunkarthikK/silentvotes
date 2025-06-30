import { useEffect, useState } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    API.get('/poll').then(res => setPolls(res.data));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/create">Create Poll</Link>
      <ul>
        {polls.map((poll) => (
          <li key={poll._id}>
            <h4>{poll.question}</h4>
            <ul>
              {poll.options.map((opt, i) => (
                <li key={i}>
                  {opt} - {poll.votes[i]} votes
                  <button onClick={() => API.post(`/poll/vote/${poll._id}`, { optionIndex: i }).then(() => window.location.reload())}>
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
