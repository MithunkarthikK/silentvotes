import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!question.trim() || options.some(opt => !opt.trim())) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      await API.post('/poll/create', { question, options });
      toast.success('Poll created successfully!');
      navigate('/dashboard');
    } catch {
      toast.error('Poll creation failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">📝 Create a New Poll</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Poll Question</label>
            <input
              type="text"
              placeholder="What's your question?"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {options.map((opt, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-gray-500 mb-1">{`Option ${idx + 1}`}</label>
                <input
                  type="text"
                  placeholder={`Enter option ${idx + 1}`}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...options];
                    newOpts[idx] = e.target.value;
                    setOptions(newOpts);
                  }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setOptions([...options, ''])}
            className="w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 transition"
          >
            ➕ Add Another Option
          </button>

          <button
            onClick={handleCreate}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-150"
          >
            ✅ Create Poll
          </button>
        </div>
      </div>
    </div>
  );
}
