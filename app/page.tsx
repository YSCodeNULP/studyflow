import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="stack-xl">
      <section className="hero card hero-card">
        <div className="hero-copy stack-md">
          <span className="pill">Сервіс для навчання і самоорганізації</span>
          <h1>Збирай курси, задачі, навчальні сесії та AI-плани в одному місці.</h1>
          <p>
            StudyFlow допомагає тримати в порядку підготовку до пар, дедлайни, конспекти та особистий прогрес.
            Вхід – через Google, дані – у Firestore, AI-помічник – через Gemini.
          </p>
          <div className="button-row">
            <Link className="button" href="/courses">Перейти до курсів</Link>
            <Link className="button secondary" href="/assistant">Відкрити AI-помічника</Link>
          </div>
        </div>
        <div className="hero-grid">
          <article className="mini-card accent-border">
            <h3>Мої курси</h3>
            <p>Зберігай предмети, викладачів і короткі нотатки.</p>
          </article>
          <article className="mini-card accent-border">
            <h3>Завдання</h3>
            <p>Розкладай дедлайни по статусах і пріоритетах.</p>
          </article>
          <article className="mini-card accent-border">
            <h3>Історія сесій</h3>
            <p>Фіксуй, коли і що саме ти вчив.</p>
          </article>
          <article className="mini-card accent-border">
            <h3>AI-помічник</h3>
            <p>Отримуй план підготовки, якщо не знаєш, з чого почати.</p>
          </article>
        </div>
      </section>

      <section className="stats-grid">
        <article className="card">
          <h3>Для кого цей сервіс</h3>
          <p>Для студентів, які хочуть тримати навчання під контролем без хаосу в нотатках і месенджерах.</p>
        </article>
        <article className="card">
          <h3>Що тут найкорисніше</h3>
          <p>Швидкий Google-вхід, збереження особистого прогресу та AI-підказки для складних тем і великих задач.</p>
        </article>
        <article className="card">
          <h3>Де дані зберігаються</h3>
          <p>Курси, задачі, історія та AI-запити прив'язуються до твого акаунта і не зникають після виходу з сайту.</p>
        </article>
      </section>
    </div>
  );
}
