import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { toast } from 'react-toastify';
import CreatePollSkeleton from '../components/CreatePollSkeleton'; // ✅ import shimmer

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleCreate = async () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true); // 🟢 show shimmer
    try {
      await API.post('/poll/create', { question, options });
      toast.success('Poll created successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Poll creation failed');
    } finally {
      setLoading(false); // 🔴 stop shimmer
    }
  };

  // ✅ Show shimmer while submitting
  if (loading) return <CreatePollSkeleton />;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">📝 Create a New Poll</h2>

        <label className="block mb-2 text-gray-700">Poll Question:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <label className="block mb-2 text-gray-700">Options:</label>
        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            placeholder={`Option ${i + 1}`}
            className="w-full border border-gray-300 rounded-md p-2 mb-2"
          />
        ))}

        <button
          onClick={() => setOptions([...options, ''])}
          className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 transition mb-4"
        >
          ➕ Add Another Option
        </button>

        <button
          onClick={handleCreate}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
        >
          ✅ Create Poll
        </button>
      </div>
    </div>
  );
}

