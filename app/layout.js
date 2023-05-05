import { Hind_Siliguri } from 'next/font/google'
const hindSiliguri = Hind_Siliguri({subsets: ['bengali', 'latin', 'latin-ext'], weight: ['300', '400', '500', '600', '700']})

import './globals.css'

export const metadata = {
  title: 'Purexam Quiz Generator',
  description: 'Purexam Quiz Generator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={hindSiliguri.className}>{children}</body>
    </html>
  )
}
