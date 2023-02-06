
import { Inter } from '@next/font/google'
import styles from '@/styles/main.module.scss'
import Seo from './components/Seo'

// Component
import Side from './components/main/side'
import MainContents from './components/main/contents'

const inter = Inter({ subsets: ['latin'] })

export default function Main() {
  return (
    <>
      <Seo title="메인페이지" />
      <main className={styles.main}>
        <Side />
        <MainContents />
      </main>
    </>
  )
}
