
// import { Inter } from '@next/font/google'
import styles from '@/styles/main.module.scss'
import Seo from './components/Seo'

// Component
import Side from './components/main/side'
import MainContents from './components/main/contents'
import { api } from './services/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { setTokenCookie } from './api/refreshToken'
import { useMemo } from 'react'
import { categoriesList } from '@/features/categorySlice'
import { useAppDispatch } from '@/store/store'

// const inter = Inter({ subsets: ['latin'] })

function Main({ categoriesData }: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const dispatch = useAppDispatch();

  const categoryAdd = useMemo(() => dispatch(categoriesList(categoriesData.category)), [])

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

  let userData = { success: false, user: null };
  let categoriesData = { success: false, category: [] }

  await api.post("/edit/categoryFind")
  .then(res => {
    if (res.data.code === "y") categoriesData = { success: true, category: res.data.data }
  })
  .catch(err => console.log("Category Load Err", err));

  if (isToken === "") userData = { success: false, user: null };
  else {
    try {
      await api.post("/user/decode", { token: isToken })
      .then(res => {
        if (res.data.code === "y") {
          setTokenCookie(isToken);
          userData = { success: true, user: res.data.data.user };
        }
      })
      .catch(err => console.log("Token Decode Err", err));
    } catch (err) {
      console.log(err);
    };
  }
  
  return {
    props: { userData, categoriesData }
  }
}
