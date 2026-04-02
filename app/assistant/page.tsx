'use client';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { AuthGate } from '@/components/AuthGate';
import { useAuthState, useUserCollections } from '@/components/Providers';
import { db } from '@/lib/firebase';
import { usePersistentState } from '@/lib/usePersistentState';

export default function AssistantPage() {
  const { user } = useAuthState();
  const { aiPlans } = useUserCollections(user?.uid);

  const [prompt, setPrompt] = usePersistentState('studyflow-ai-prompt', '');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function handleGenerate(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setResult('');

    if (!prompt.trim()) {
      setError('Спочатку опиши, що саме потрібно вивчити.');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Не вдалося отримати відповідь від AI.');
      }

      setResult(data.result);

      if (db && user) {
        await addDoc(collection(db, `users/${user.uid}/aiPlans`), {
          prompt: prompt.trim(),
          result: data.result,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGate
      title="Увійди, щоб користуватися AI-помічником"
      text="Після входу ти зможеш генерувати особисті плани підготовки і зберігати історію запитів."
    >
      <div className="assistant-layout">
        <form className="card stack-md" onSubmit={handleGenerate}>
          <div className="section-title-row">
            <h2>AI-помічник</h2>
            <span className="muted">Gemini формує план підготовки</span>
          </div>

          <label>
            Що тобі потрібно вивчити
            <textarea
              rows={8}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Наприклад: Потрібно підготуватися до теми REST API у веб-програмуванні за 3 дні. Я знаю базовий JavaScript, але погано розумію HTTP-методи, статус-коди і роботу з fetch."
            />
          </label>

          <button className="button fit" disabled={loading} type="submit">
            {loading ? 'Генеруємо план...' : 'Згенерувати план'}
          </button>

          {error ? <p className="error-text">{error}</p> : null}

          {result ? (
            <section className="result-box">
              <h3>План підготовки</h3>
              <pre>{result}</pre>
            </section>
          ) : null}
        </form>

        <section className="card stack-md assistant-history-card">
          <div className="section-title-row">
            <h2>Останні запити</h2>
            <span className="muted">Зберігаються в твоєму профілі</span>
          </div>

          <div className="assistant-history-list">
            {aiPlans.items.length ? (
              aiPlans.items.map((plan) => {
                const isExpanded = expandedId === plan.id;
                const preview =
                  plan.result.length > 260
                    ? `${plan.result.slice(0, 260).trim()}…`
                    : plan.result;

                return (
                  <article className="mini-card history-item" key={plan.id}>
                    <strong className="history-prompt">{plan.prompt}</strong>

                    <pre className="history-result">
                      {isExpanded ? plan.result : preview}
                    </pre>

                    <div className="button-row top-space">
                      <button
                        type="button"
                        className="ghost-button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : plan.id)
                        }
                      >
                        {isExpanded ? 'Згорнути' : 'Розгорнути'}
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <p className="muted">Поки що ти не створював AI-планів.</p>
            )}
          </div>
        </section>
      </div>
    </AuthGate>
  );
}
