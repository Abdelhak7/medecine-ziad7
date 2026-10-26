import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'PharmaDZ Clinical - Pharmacopée & Sécurité Thérapeutique',
  description: 'Système clinique d\'aide à la décision thérapeutique, validation posologique, analyse des interactions et formulaire CNAS pour praticiens hospitaliers et libéraux.',
  openGraph: {
    title: 'PharmaDZ Clinical - Pharmacopée & Sécurité Thérapeutique',
    description: 'Système clinique d\'aide à la décision thérapeutique, validation posologique, analyse des interactions et formulaire CNAS pour praticiens hospitaliers et libéraux.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PharmaDZ Clinical - Pharmacopée & Sécurité Thérapeutique',
    description: 'Système clinique d\'aide à la décision thérapeutique, validation posologique, analyse des interactions et formulaire CNAS pour praticiens hospitaliers et libéraux.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
