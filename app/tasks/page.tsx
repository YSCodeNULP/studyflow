'use client';

import { AuthGate } from '@/components/AuthGate';
import { AddTaskForm } from '@/components/Forms';
import { useAuthState, useUserCollections } from '@/components/Providers';
import { TaskBoard } from '@/components/TaskBoard';

export default function TasksPage() {
  const { user } = useAuthState();
  const { courses, tasks } = useUserCollections(user?.uid);

  return (
    <AuthGate
      title="Увійди, щоб керувати завданнями"
      text="Після входу ти зможеш додавати дедлайни, пріоритети та відмічати прогрес по задачах."
    >
      {!user ? null : (
        <div className="stack-xl">
          <AddTaskForm userId={user.uid} courses={courses.items} />
          <TaskBoard userId={user.uid} tasks={tasks.items} courses={courses.items} />
        </div>
      )}
    </AuthGate>
  );
}
