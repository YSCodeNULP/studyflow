'use client';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course, Task } from '@/lib/types';

const labels: Record<Task['status'], string> = {
  todo: 'Заплановано',
  in_progress: 'У процесі',
  done: 'Готово'
};

const priorities: Record<Task['priority'], string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий'
};

export function TaskBoard({
  userId,
  tasks,
  courses
}: {
  userId: string;
  tasks: Task[];
  courses: Course[];
}) {
  async function moveTask(taskId: string, status: Task['status']) {
    if (!db) return;
    await updateDoc(doc(db, `users/${userId}/tasks`, taskId), { status });
  }

  const courseMap = new Map(courses.map((course) => [course.id, course.title]));

  return (
    <div className="task-columns">
      {(['todo', 'in_progress', 'done'] as Task['status'][]).map((status) => (
        <section className="card task-column" key={status}>
          <div className="section-title-row">
            <h3>{labels[status]}</h3>
            <span className="muted">
              {tasks.filter((task) => task.status === status).length} шт.
            </span>
          </div>

          <div className="stack-md">
            {tasks
              .filter((task) => task.status === status)
              .map((task) => (
                <article className="mini-card" key={task.id}>
                  <div className="row-between gap-sm wrap">
                    <strong>{task.title}</strong>
                    <span className={`badge priority-${task.priority}`}>
                      {priorities[task.priority]}
                    </span>
                  </div>

                  <p className="muted small">
                    {courseMap.get(task.courseId || '') || "Без прив'язки до курсу"}
                  </p>

                  {task.details ? <p>{task.details}</p> : null}

                  <div className="row-between gap-sm wrap top-space">
                    <span className="small muted">
                      {task.deadline ? `Дедлайн: ${task.deadline}` : 'Без дедлайну'}
                    </span>

                    <div className="button-row">
                      {status !== 'todo' && (
                        <button
                          className="ghost-button"
                          onClick={() => void moveTask(task.id, 'todo')}
                        >
                          Назад
                        </button>
                      )}

                      {status === 'todo' && (
                        <button
                          className="ghost-button"
                          onClick={() => void moveTask(task.id, 'in_progress')}
                        >
                          Почати
                        </button>
                      )}

                      {status === 'in_progress' && (
                        <button
                          className="ghost-button"
                          onClick={() => void moveTask(task.id, 'done')}
                        >
                          Завершити
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              ))}

            {!tasks.some((task) => task.status === status) ? (
              <p className="muted">Поки що порожньо.</p>
            ) : null}
          </div>
        </section>
      ))}
    </div>
  );
}
