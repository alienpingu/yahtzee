import { Fredoka } from 'next/font/google';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

export const metadata = {
  title: 'Yatzy',
  description: 'A vibrant dice game for 1-4 players',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fredoka.variable}>
      <body>{children}</body>
    </html>
  );
}
