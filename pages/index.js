// pages/index.js
import { useState, useEffect } from 'react';

const BUNDLES = {
  STARTER50: 50,
  PRO250: 250,
  RECRUITER500: 500
};

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

  const [credits, setCredits] = useState(0);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemMsg, setRedeemMsg] = useState('');

  // Load credits from localStorage on mount
  useEffect(() => {
    const stored = parseInt(localStorage.getItem('credits') || '0', 10);
    setCredits(stored);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Redeem purchase code to add credits
  const handleRedeem = () => {
    const code = redeemCode.trim().toUpperCase();
    if (BUNDLES[code]) {
      const added = BUNDLES[code];
      const updated = credits + added;
      setCredits(updated);
      localStorage.setItem('credits', updated);
      setRedeemMsg(`Success! You’ve added ${added} credits.`);
    } else {
      setRedeemMsg('Invalid code. Please check your purchase email.');
    }
    setRedeemCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Gate on credits
    if (credits <= 0) {
      setRedeemMsg('No credits left. Please redeem a code.');
      return;
    }

    setLoading(true);
    setResult('');

    // Deduct one credit
    const newCount = credits - 1;
    setCredits(newCount);
    localStorage.setItem('credits', newCount);

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
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Form Section */}
          <div className="flex-1">
            {/* Logo */}
            <img src="/logo.png" alt="JKS Advisory" className="mx-auto mb-4 w-32" />

            {/* Title */}
            <h1 className="text-3xl font-bold mb-1 text-center">
              ColdMail AI for Recruiters
            </h1>
            <p className="text-center text-sm text-gray-600 mb-6">
              by JKS Advisory
            </p>

            {/* Credit Balance */}
            <div className="mb-4 text-center">
              You have <span className="font-bold">{credits}</span> credits remaining.
            </div>

            {/* Redeem Code */}
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <label className="block mb-2 font-medium">Redeem Code</label>
              <div className="flex gap-2">
                <input
                  value={redeemCode}
                  onChange={(e) => {
                    setRedeemCode(e.target.value);
                    setRedeemMsg('');
                  }}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleRedeem}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  Redeem
                </button>
              </div>
              {redeemMsg && <p className="mt-2 text-sm">{redeemMsg}</p>}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Candidate Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Candidate's current (or last) Job Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Backend Developer"
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
                  placeholder="e.g. 6 years at Amazon, Python & AWS expert"
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Example: “6 years backend development at Amazon, expert in Python, AWS”
                </p>
              </div>

              <div>
                <label className="block mb-1 font-medium">Your Pitch</label>
                <textarea
                  name="pitch"
                  value={form.pitch}
                  onChange={handleChange}
                  placeholder="e.g. We're building an AI hiring platform and need your expertise"
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={2}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Example: “We’re building a next-gen AI hiring platform and would love to discuss your fit as our Backend Lead.”
                </p>
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
          </div>

          {/* Result Section */}
          <div className="flex-1 bg-gray-50 p-6 rounded-lg">
            {result ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Generated Email</h2>
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </>
            ) : (
              <p className="text-gray-500">Your generated email will appear here.</p>
            )}
          </div>

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
    </div>
  );
}
