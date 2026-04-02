'use client';

import { useAuthState } from './Providers';

export function AuthGate({
  title,
  text,
  children
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  const { user, loading, login, configured } = useAuthState();

  if (!configured) {
    return (
      <section className="card center-card">
        <h2>Потрібно налаштувати Firebase</h2>
        <p>
          Додай ключі у файл <code>.env.local</code>, увімкни Google-вхід у Firebase Auth та створи Firestore.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="card center-card">
        <h2>Завантаження</h2>
        <p>Перевіряємо сесію користувача.</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="card center-card">
        <h2>{title}</h2>
        <p>{text}</p>
        <button className="button" onClick={() => void login()}>
          Увійти через Google
        </button>
      </section>
    );
  }

  return <>{children}</>;
}
