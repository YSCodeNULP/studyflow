'use client';

import { useMemo, useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Course } from '@/lib/types';
import { usePersistentState } from '@/lib/usePersistentState';

const courseColors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function AddCourseForm({ userId }: { userId: string }) {
  const [title, setTitle] = usePersistentState('studyflow-course-title', '');
  const [instructor, setInstructor] = usePersistentState('studyflow-course-instructor', '');
  const [notes, setNotes] = usePersistentState('studyflow-course-notes', '');
  const [color, setColor] = usePersistentState('studyflow-course-color', courseColors[0]);

  const disabled = useMemo(() => !title.trim() || !instructor.trim() || !db, [title, instructor]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!db || disabled) return;

    await addDoc(collection(db, `users/${userId}/courses`), {
      title: title.trim(),
      instructor: instructor.trim(),
      notes: notes.trim(),
      color,
      createdAt: serverTimestamp()
    } satisfies Omit<Course, 'id'> & { createdAt: unknown });

    setTitle('');
    setInstructor('');
    setNotes('');
    setColor(courseColors[0]);
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <h3>Додати курс</h3>
        <span className="muted">Збережеться в твоєму профілі</span>
      </div>
      <label>
        Назва курсу
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Наприклад, Веб-програмування" />
      </label>
      <label>
        Викладач
        <input value={instructor} onChange={(event) => setInstructor(event.target.value)} placeholder="Наприклад, Мальцев Е.Є." />
      </label>
      <label className="full">
        Короткі нотатки
        <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} placeholder="Що важливо тримати в голові по цьому курсу" />
      </label>
      <label className="full">
        Колір картки
        <div className="color-row">
          {courseColors.map((item) => (
            <button
              type="button"
              key={item}
              className={color === item ? 'color-swatch active' : 'color-swatch'}
              style={{ background: item }}
              onClick={() => setColor(item)}
              aria-label={`Обрати колір ${item}`}
            />
          ))}
        </div>
      </label>
      <button className="button fit" type="submit" disabled={disabled}>
        Зберегти курс
      </button>
    </form>
  );
}

export function AddTaskForm({ userId, courses }: { userId: string; courses: Course[] }) {
  const [title, setTitle] = usePersistentState('studyflow-task-title', '');
  const [courseId, setCourseId] = usePersistentState('studyflow-task-courseId', '');
  const [deadline, setDeadline] = usePersistentState('studyflow-task-deadline', '');
  const [priority, setPriority] = usePersistentState<'low' | 'medium' | 'high'>(
    'studyflow-task-priority',
    'medium'
  );
  const [details, setDetails] = usePersistentState('studyflow-task-details', '');

  const disabled = useMemo(() => !title.trim() || !db, [title]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!db || disabled) return;

    await addDoc(collection(db, `users/${userId}/tasks`), {
      title: title.trim(),
      courseId: courseId || '',
      deadline,
      priority,
      status: 'todo',
      details: details.trim(),
      createdAt: serverTimestamp()
    });

    setTitle('');
    setCourseId('');
    setDeadline('');
    setPriority('medium');
    setDetails('');
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <h3>Нове завдання</h3>
        <span className="muted">Дедлайн, пріоритет, короткий опис</span>
      </div>
      <label>
        Назва
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Наприклад, Підготувати звіт до лабораторної" />
      </label>
      <label>
        Курс
        <select value={courseId} onChange={(event) => setCourseId(event.target.value)}>
          <option value="">Без прив'язки</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </label>
      <label>
        Дедлайн
        <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
      </label>
      <label>
        Пріоритет
        <select value={priority} onChange={(event) => setPriority(event.target.value as 'low' | 'medium' | 'high')}>
          <option value="low">Низький</option>
          <option value="medium">Середній</option>
          <option value="high">Високий</option>
        </select>
      </label>
      <label className="full">
        Деталі
        <textarea value={details} onChange={(event) => setDetails(event.target.value)} rows={3} placeholder="Що саме треба зробити" />
      </label>
      <button className="button fit" type="submit" disabled={disabled}>Додати завдання</button>
    </form>
  );
}

export function AddSessionForm({ userId }: { userId: string }) {
  const [title, setTitle] = usePersistentState('studyflow-session-title', '');
  const [duration, setDuration] = usePersistentState('studyflow-session-duration', '60');
  const [date, setDate] = usePersistentState(
    'studyflow-session-date',
    new Date().toISOString().slice(0, 10)
  );
  const [summary, setSummary] = usePersistentState('studyflow-session-summary', '');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!db || !title.trim()) return;

    await addDoc(collection(db, `users/${userId}/sessions`), {
      title: title.trim(),
      duration: Number(duration || 0),
      date,
      summary: summary.trim(),
      createdAt: serverTimestamp()
    });

    setTitle('');
    setDuration('60');
    setDate(new Date().toISOString().slice(0, 10));
    setSummary('');
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="section-title-row">
        <h3>Додати навчальну сесію</h3>
        <span className="muted">Що вчив і скільки часу витратив</span>
      </div>
      <label>
        Назва сесії
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Наприклад, Практика по React" />
      </label>
      <label>
        Тривалість, хв
        <input type="number" min="15" step="15" value={duration} onChange={(event) => setDuration(event.target.value)} />
      </label>
      <label>
        Дата
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      </label>
      <label className="full">
        Короткий підсумок
        <textarea value={summary} onChange={(event) => setSummary(event.target.value)} rows={3} placeholder="Що вдалося зробити за цю сесію" />
      </label>
      <button className="button fit" type="submit">Зберегти сесію</button>
    </form>
  );
}
