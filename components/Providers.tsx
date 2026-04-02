'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type DocumentData
} from 'firebase/firestore';
import type { AIPlan, Course, StudySession, Task } from '@/lib/types';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  configured: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => undefined,
  logout: async () => undefined,
  configured: false
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setLoading(false);

      if (nextUser && db) {
        const userRef = doc(db, 'users', nextUser.uid);
        const existing = await getDoc(userRef);

        if (!existing.exists()) {
          await setDoc(userRef, {
            displayName: nextUser.displayName || 'Студент',
            email: nextUser.email || '',
            photoURL: nextUser.photoURL || '',
            createdAt: serverTimestamp()
          });
        }
      }
    });

    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
      login: async () => {
        if (!auth || !googleProvider) return;
        await signInWithPopup(auth, googleProvider);
      },
      logout: async () => {
        if (!auth) return;
        await signOut(auth);
      }
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthState() {
  return useContext(AuthContext);
}

export function useCollectionData<T extends DocumentData>(path: string, enabled = true) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !enabled) {
      setItems([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const nextItems = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      })) as unknown as T[];

      setItems(nextItems);
      setLoading(false);
    });

    return () => unsub();
  }, [path, enabled]);

  return { items, loading };
}

export function useUserCollections(userId?: string) {
  const courses = useCollectionData<Course>(`users/${userId}/courses`, Boolean(userId));
  const tasks = useCollectionData<Task>(`users/${userId}/tasks`, Boolean(userId));
  const sessions = useCollectionData<StudySession>(`users/${userId}/sessions`, Boolean(userId));
  const aiPlans = useCollectionData<AIPlan>(`users/${userId}/aiPlans`, Boolean(userId));

  return { courses, tasks, sessions, aiPlans };
}
