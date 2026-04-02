'use client';

import { AuthGate } from '@/components/AuthGate';
import { AddSessionForm } from '@/components/Forms';
import { useAuthState, useUserCollections } from '@/components/Providers';

export default function HistoryPage() {
  const { user } = useAuthState();
  const { sessions } = useUserCollections(user?.uid);

  const totalMinutes = sessions.items.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0
  );

  return (
    <AuthGate
      title="Увійди, щоб бачити історію навчання"
      text="Тут зберігаються твої навчальні сесії: дата, тема і короткий підсумок."
    >
      {!user ? null : (
        <div className="stack-xl">
          <section className="stats-grid">
            <article className="card">
              <h3>Усього сесій</h3>
              <p className="big-number">{sessions.items.length}</p>
            </article>

            <article className="card">
              <h3>Сумарно хвилин</h3>
              <p className="big-number">{totalMinutes}</p>
            </article>

            <article className="card">
              <h3>Середня сесія</h3>
              <p className="big-number">
                {sessions.items.length ? Math.round(totalMinutes / sessions.items.length) : 0}
              </p>
            </article>
          </section>

          <AddSessionForm userId={user.uid} />

          <section className="stack-md">
            <div className="section-title-row">
              <h2>Останні сесії</h2>
              <span className="muted">Від нових до старих</span>
            </div>

            <div className="stack-md">
              {sessions.items.map((session) => (
                <article key={session.id} className="card list-card">
                  <div className="row-between gap-sm wrap">
                    <div>
                      <h3>{session.title}</h3>
                      <p className="muted">
                        {session.date} • {session.duration} хв
                      </p>
                    </div>
                  </div>

                  {session.summary ? (
                    <p>{session.summary}</p>
                  ) : (
                    <p className="muted">Короткого підсумку ще немає.</p>
                  )}
                </article>
              ))}

              {!sessions.items.length ? (
                <section className="card center-card">
                  <p>Поки що немає жодної навчальної сесії.</p>
                </section>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </AuthGate>
  );
}
