
// import { Inter } from '@next/font/google'
import styles from '@/styles/main.module.scss'
import Seo from './components/Seo'

// Component
import Side from './components/main/side'
import MainContents from './components/main/contents'
import { api } from './services/api'
import { GetServerSideProps } from 'next'
import { setTokenCookie } from './api/refreshToken'

// const inter = Inter({ subsets: ['latin'] })

function Main() {

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
        if (res.data.code === "y") {
          setTokenCookie(isToken);
          profile = { success: true, user: res.data.data.user };
        }
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