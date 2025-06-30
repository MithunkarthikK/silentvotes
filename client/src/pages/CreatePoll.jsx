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
      const userId = 'mock-user'; // replace with decoded JWT if needed
      await API.post('/poll/create', { question, options, userId });
      toast.success('Poll created');
      navigate('/dashboard');
    } catch {
      toast.error('Poll creation failed');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Create New Poll</h2>
      <input
        className="w-full p-2 border rounded mb-4"
        placeholder="Poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          className="w-full p-2 border rounded mb-2"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => {
            const newOpts = [...options];
            newOpts[idx] = e.target.value;
            setOptions(newOpts);
          }}
        />
      ))}
      <button
        onClick={() => setOptions([...options, ''])}
        className="bg-gray-300 text-sm px-3 py-1 rounded mb-4"
      >+ Add Option</button>
      <br />
      <button
        onClick={handleCreate}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >Create Poll</button>
    </div>
  );
}