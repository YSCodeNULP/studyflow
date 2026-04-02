'use client';

import { AuthGate } from '@/components/AuthGate';
import { useAuthState, useUserCollections } from '@/components/Providers';

export default function ProfilePage() {
  const { user } = useAuthState();
  const { courses, tasks, sessions, aiPlans } = useUserCollections(user?.uid);

  return (
    <AuthGate title="Увійди, щоб переглянути профіль" text="Профіль показує основну інформацію по акаунту та твоїй активності в сервісі.">
      <div className="stack-xl">
        <section className="card profile-card">
          <div className="profile-header">
            {user?.photoURL ? <img className="avatar" src={user.photoURL} alt="Аватар" /> : <div className="avatar fallback">{user?.displayName?.[0] || 'S'}</div>}
            <div className="stack-xs">
              <h2>{user?.displayName || 'Студент'}</h2>
              <p className="muted">{user?.email}</p>
              <span className="pill">Google-профіль підключено</span>
            </div>
          </div>
        </section>

        <section className="stats-grid">
          <article className="card"><h3>Курси</h3><p className="big-number">{courses.items.length}</p></article>
          <article className="card"><h3>Завдання</h3><p className="big-number">{tasks.items.length}</p></article>
          <article className="card"><h3>Сесії</h3><p className="big-number">{sessions.items.length}</p></article>
          <article className="card"><h3>AI-плани</h3><p className="big-number">{aiPlans.items.length}</p></article>
        </section>
      </div>
    </AuthGate>
  );
}
