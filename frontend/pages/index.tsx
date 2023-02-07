
import { Inter } from '@next/font/google'
import styles from '@/styles/main.module.scss'
import Seo from './components/Seo'

// Component
import Side from './components/main/side'
import MainContents from './components/main/contents'
import { nextBaseUrl } from './services/api'
import cookies from 'next-cookies'
import { GetServerSideProps } from 'next'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })

function Main({ isLogin }: { isLogin: String}) {

  // const data = axios.get('/api/refreshToken');
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const isLogin = context.req.cookies.token;

  // cookies();

  return {
    props: {
      isLogin
    }
  }
}

export default Main;