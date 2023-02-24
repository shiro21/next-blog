
// import { Inter } from '@next/font/google'
import styles from '@/styles/main.module.scss'
import Seo from './components/Seo'
import jwt from 'jsonwebtoken'

// Component
import Side from './components/main/side'
import MainContents from './components/main/contents'
import { api } from './services/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import { categoriesList } from '@/features/categorySlice'
import { useAppDispatch } from '@/store/store'
import { postsList } from '@/features/postSlice'
import { userList } from '@/features/userSlice'
import { linksList } from '@/features/linkSlice'
import cookies from 'next-cookies'
import { setTokenCookie } from './api/refreshToken';

// const inter = Inter({ subsets: ['latin'] })

function Main({ categoriesData, postsData, userData, linkData }: InferGetServerSidePropsType<typeof getServerSideProps>) {


  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(categoriesList(categoriesData.category));
    dispatch(postsList(postsData.post));
    dispatch(userList(userData.user));
    dispatch(linksList(linkData.link));
  }, []);


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

  let userData = { success: false, user: {} };
  let categoriesData = { success: false, category: [] };
  let postsData = { success: false, post: [] };
  let linkData = { success: false, link: [] };

  try {
    await api.post("/total/categoryAndPosts")
    .then(res => {
      if (res.data.code === "y") {
        categoriesData = { success: true, category: res.data.categories }
        postsData = { success: true, post: res.data.posts }
        linkData = { success: true, link: res.data.links }
      }
    })
    .catch(err => console.log("Category Load Err", err));
  } catch (err) {
    console.log(err);
  }
  
  if (isToken === "") userData = { success: false, user: {} };
  else {

    try {

      // 토큰 시간 갱신해주기. 아래 방법으로 쿠키 가져오는게 더 깔끔한듯.
      const refreshToken = cookies(context)["@nextjs-blog-token"] || "";
      await setTokenCookie(context, refreshToken);

      const token: any = jwt.decode(refreshToken, { complete: true });
      
      if (token === null) userData = { success: false, user: {} };
      else userData = { success: true, user: token.payload.user };

    } catch (err) {
      console.log(err);
    };
  }
  
  return {
    props: { userData, categoriesData, postsData, linkData }
  }
}
