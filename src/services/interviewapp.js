import React, { useState, useEffect, useRef } from 'react';

// AI Timed Interview — Full Stack React role specific
// Flow:
// - 6 questions total: 2 Easy, 2 Medium, 2 Hard
// - Each shown one at a time
// - Timers: Easy 20s, Medium 60s, Hard 120s
// - Auto-submit on timeout
// - After all questions, AI calculates final score and summary

export default function TimedInterviewApp() {
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [finalSummary, setFinalSummary] = useState(null);

  const questionPlan = [
    { difficulty: 'easy', time: 20 },
    { difficulty: 'easy', time: 20 },
    { difficulty: 'medium', time: 60 },
    { difficulty: 'medium', time: 60 },
    { difficulty: 'hard', time: 120 },
    { difficulty: 'hard', time: 120 },
  ];

  useEffect(() => {
    if (running && questions.length > 0) {
      startTimer(questionPlan[currentIndex].time);
      return stopTimer;
    }
  }, [running, currentIndex, questions]);

  function startTimer(seconds) {
    stopTimer();
    setTimer(seconds);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }
  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  async function onStart() {
    setRunning(true);
    setCurrentIndex(0);
    setQuestions([]);
    setFeedback([]);
    setFinalSummary(null);

    const qs = [];
    for (let i = 0; i < questionPlan.length; i++) {
      const { difficulty } = questionPlan[i];
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/generate-question', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: 'full stack (React)', difficulty }),
        });
        const data = await res.json();
        qs.push({ id: data.questionId || `q-${i}`, text: data.questionText, difficulty });
      } catch (err) {
        console.error('generate-question failed', err);
        qs.push({ id: `q-${i}`, text: '(Error generating question)', difficulty });
      } finally {
        setLoading(false);
      }
    }
    setQuestions(qs);
  }

  async function submitAnswer(moveNext = true) {
    const q = questions[currentIndex];
    stopTimer();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/judge-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: q.id, questionText: q.text, answerText: userAnswer }),
      });
      const data = await res.json();
      setFeedback((f) => [...f, { questionId: q.id, score: data.score, feedback: data.feedback }]);
    } catch (err) {
      console.error('judge-answer failed', err);
      setFeedback((f) => [...f, { questionId: q.id, score: 0, feedback: 'Error grading answer' }]);
    } finally {
      setLoading(false);
      setUserAnswer('');
      if (moveNext) goToNext();
    }
  }

  function onTimeUp() {
    submitAnswer(true);
  }

  function goToNext() {
    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }
    setCurrentIndex((i) => i + 1);
  }

  async function finishInterview() {
    setRunning(false);
    stopTimer();
    try {
      const res = await fetch('/api/final-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, questions }),
      });
      const data = await res.json();
      setFinalSummary(data);
    } catch (err) {
      console.error('final-summary failed', err);
      const total = feedback.reduce((s, f) => s + (f.score || 0), 0);
      const avg = feedback.length ? total / feedback.length : 0;
      setFinalSummary({ score: avg, summary: 'Error generating summary.' });
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Full Stack (React) AI Interview</h1>

      {!running && !finalSummary && (
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onStart}>
          Start Interview
        </button>
      )}

      {running && questions.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>Question {currentIndex + 1} / {questions.length} ({questions[currentIndex].difficulty})</div>
            <div className="font-mono">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</div>
          </div>

          <div className="p-4 border rounded bg-gray-50">{questions[currentIndex].text}</div>

          <textarea className="w-full p-2 border rounded min-h-[120px]" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} />

          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => submitAnswer(true)}>Submit & Next</button>
            <button className="px-4 py-2 border rounded" onClick={() => submitAnswer(false)}>Save Only</button>
            <button className="px-4 py-2 border rounded" onClick={() => { setRunning(false); stopTimer(); }}>Stop</button>
          </div>

          <div>
            <h3 className="font-semibold">Feedback so far</h3>
            <ul className="list-disc ml-5">
              {feedback.map((f, i) => (
                <li key={i}>Q{i + 1}: Score {f.score} — {f.feedback}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {!running && finalSummary && (
        <div className="mt-6 p-4 border rounded bg-white">
          <h2 className="text-xl font-bold">Interview Summary</h2>
          <p>Final Score: {finalSummary.score}</p>
          <p>{finalSummary.summary}</p>
        </div>
      )}

      {loading && <div className="mt-4 text-sm text-gray-600">Contacting AI service...</div>}

     
    </div>
  );
}

/*
SAMPLE Node/Express backend (server.js) — keep OPENAI_API_KEY in env vars

const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.json());

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

app.post('/api/generate-question', async (req, res) => {
  const { topic='full stack (React)', difficulty='medium' } = req.body;
  const prompt = `Generate a ${difficulty} technical interview question for a ${topic} candidate. Return only the question.`;
  const r = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
  });
  res.json({ questionId: `q-${Date.now()}`, questionText: r.data.choices[0].message.content.trim() });
});

app.post('/api/judge-answer', async (req, res) => {
  const { questionText, answerText } = req.body;
  const prompt = `Rate the following candidate's answer from 0-10 and provide 1-2 sentences feedback.\n\nQuestion: ${questionText}\n\nAnswer: ${answerText}`;
  const r = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });
  const content = r.data.choices[0].message.content;
  const scoreMatch = content.match(/(\d{1,2})/);
  const score = scoreMatch ? Number(scoreMatch[1]) : null;
  res.json({ score, feedback: content });
});

app.post('/api/final-summary', async (req, res) => {
  const { feedback, questions } = req.body;
  const prompt = `You are an interviewer. Given these ${questions.length} questions with feedback and scores: ${JSON.stringify(feedback)}\n\nGenerate a final numeric score (0-10 scale) and a short 2-3 sentence summary of candidate performance. Respond as JSON {\"score\": number, \"summary\": string}.`;
  const r = await openai.createChatCompletion({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
  });
  let parsed;
  try {
    parsed = JSON.parse(r.data.choices[0].message.content);
  } catch (e) {
    parsed = { score: 0, summary: r.data.choices[0].message.content };
  }
  res.json(parsed);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
*/
