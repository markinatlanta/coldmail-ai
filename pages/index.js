import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    name: '',
    title: '',
    skills: '',
    pitch: '',
    tone: 'friendly'
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const { email } = await res.json();
      setResult(email);
    } catch {
      setResult('Error generating email. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        {/* Logo */}
        <img src="/logo.png" alt="JKS Advisory" className="mx-auto mb-4 w-32" />

        {/* Title */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          ColdMail AI by JKS Advisory
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Candidate Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Job Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Skills / Background</label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Your Pitch</label>
            <textarea
              name="pitch"
              value={form.pitch}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Tone</label>
            <select
              name="tone"
              value={form.tone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="friendly">Friendly</option>
              <option value="persuasive">Persuasive</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            {loading ? 'Generating…' : 'Generate Email'}
          </button>
        </form>

        {/* Generated Email Result */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold mb-2">Generated Email</h2>
            <pre className="whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-gray-500">
        Powered by{' '}
        <a
          href="https://www.advisoryjks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          JKS Advisory
        </a>
      </footer>
    </div>
  );
}
