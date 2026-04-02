import './globals.css';
import { AppProviders } from '@/components/Providers';
import { Header } from '@/components/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'StudyFlow',
  description: 'Веб-застосунок для планування навчання з Google-входом, Firestore та AI-помічником.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <AppProviders>
          <Header />
          <main className="shell page-wrap">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
