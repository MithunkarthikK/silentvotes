import { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const userId = "mock-user"; // You can replace this with decoded JWT later
    await API.post('/poll/create', { question, options, userId });
    alert('Poll created');
    navigate('/dashboard');
  };

  return (
    <div>
      <h2>Create Poll</h2>
      <input value={question} placeholder="Question" onChange={(e) => setQuestion(e.target.value)} />
      {options.map((opt, i) => (
        <input key={i} placeholder={`Option ${i + 1}`} value={opt} onChange={(e) => {
          const copy = [...options];
          copy[i] = e.target.value;
          setOptions(copy);
        }} />
      ))}
      <button onClick={() => setOptions([...options, ''])}>+ Add Option</button>
      <button onClick={handleCreate}>Create Poll</button>
    </div>
  );
}
