'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthState } from './Providers';

const links = [
  { href: '/', label: 'Головна' },
  { href: '/courses', label: 'Мої курси' },
  { href: '/tasks', label: 'Завдання' },
  { href: '/history', label: 'Історія' },
  { href: '/assistant', label: 'AI-помічник' },
  { href: '/profile', label: 'Профіль' }
];

export function Header() {
  const pathname = usePathname();
  const { user, login, logout, configured } = useAuthState();

  return (
    <header className="site-header">
      <div className="shell header-row">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>StudyFlow</strong>
            <span>Плануй навчання без хаосу</span>
          </div>
        </Link>

        <nav className="main-nav">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="auth-block">
          {!configured ? (
            <span className="pill warning">Спершу налаштуй Firebase</span>
          ) : user ? (
            <>
              <div className="user-chip">
                {user.photoURL ? <img src={user.photoURL} alt="Аватар" /> : <span>{user.displayName?.[0] || 'S'}</span>}
                <div>
                  <strong>{user.displayName || 'Студент'}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              <button className="button secondary small" onClick={() => void logout()}>
                Вийти
              </button>
            </>
          ) : (
            <button className="button small" onClick={() => void login()}>
              Увійти через Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
