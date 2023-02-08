
import { Inter } from '@next/font/google'
import styles from '@/styles/main.module.scss'
import Seo from './components/Seo'

// Component
import Side from './components/main/side'
import MainContents from './components/main/contents'
import { api, nextBaseUrl } from './services/api'
import cookies from 'next-cookies'
import { GetServerSideProps } from 'next'
import axios from 'axios'

const inter = Inter({ subsets: ['latin'] })

function Main() {

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

export default Main;

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const isToken = context.req.cookies["@nextjs-blog-token"] !== undefined ? context.req.cookies["@nextjs-blog-token"] : "";

  let profile = { success: false, user: null };

  if (isToken === "") profile = { success: false, user: null };
  else {
    try {
      await api.post("/user/decode", { token: isToken })
      .then(res => {
        if (res.data.code === "y") profile = { success: true, user: res.data.data.user };
      })
      .catch(err => console.log("Token Decode Err", err));
    
    } catch (err) {
      console.log(err);
    };
  }
  
  return {
    props: { profile }
  }
}