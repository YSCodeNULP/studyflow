'use client';

import { AuthGate } from '@/components/AuthGate';
import { AddCourseForm } from '@/components/Forms';
import { useAuthState, useUserCollections } from '@/components/Providers';

export default function CoursesPage() {
  const { user } = useAuthState();
  const { courses } = useUserCollections(user?.uid);

  return (
    <AuthGate
      title="Увійди, щоб бачити свої курси"
      text="Після входу ти зможеш додавати предмети, короткі нотатки та тримати все в одному місці."
    >
      {!user ? null : (
        <div className="page-grid stack-xl">
          <AddCourseForm userId={user.uid} />

          <section className="stack-md">
            <div className="section-title-row">
              <h2>Мої курси</h2>
              <span className="muted">{courses.items.length} записів</span>
            </div>

            <div className="course-grid">
              {courses.items.map((course) => (
                <article
                  className="card course-card"
                  key={course.id}
                  style={{ borderTopColor: course.color }}
                >
                  <div className="row-between gap-sm wrap">
                    <h3>{course.title}</h3>
                    <span className="color-dot" style={{ background: course.color }} />
                  </div>

                  <p className="muted">Викладач: {course.instructor}</p>
                  {course.notes ? (
                    <p>{course.notes}</p>
                  ) : (
                    <p className="muted">Нотаток ще немає.</p>
                  )}
                </article>
              ))}

              {!courses.items.length ? (
                <section className="card center-card">
                  <p>Поки що курсів немає. Почни з першого предмета.</p>
                </section>
              ) : null}
            </div>
          </section>
        </div>
      )}
    </AuthGate>
  );
}
