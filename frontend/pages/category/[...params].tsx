
import styles from '@/styles/main.module.scss'
import Seo from '../components/Seo'

// Component
import Side from '../components/main/side'
import MainContents from '../components/main/contents'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { setTokenCookie } from '../api/refreshToken'
import { api } from '../services/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useAppDispatch } from '@/store/store'
import { categoriesList } from '@/features/categorySlice'
import { postsList } from '@/features/postSlice'

const MainParams = ({ categoriesData, postsData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(categoriesList(categoriesData.category));
    dispatch(postsList(postsData.post));
  }, [categoriesData.category])

  const router = useRouter();
  const [title, setTitle] = useState("");
  
  useEffect(() => {
      
      if (router.query.params === undefined) return;

      setTitle(router.query.params[router.query.params.length - 1]);
  }, [router]);


  return (
      <>
          <Seo title={title} />
          <main className={styles.main}>
              <Side />
              <MainContents />
          </main>
      </>
  );
}

export default MainParams;

export const getServerSideProps: GetServerSideProps = async (context) => {

  const isToken = context.req.cookies["@nextjs-blog-token"] !== undefined ? context.req.cookies["@nextjs-blog-token"] : "";
  
  let userData = { success: false, user: {} };
  let categoriesData = { success: false, category: [] };
  let postsData = { success: false, post: [] };

  if (context.params) {
    await api.post("/total/params", { type: context.params })
    .then(res => {
      if (res.data.code === "y") {
        categoriesData = { success: true, category: res.data.categories }
        postsData = { success: true, post: res.data.posts }
      }
    })
    .catch(err => console.log("Load Err", err));
  }

  if (isToken === "") userData = { success: false, user: {} };
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
    props: { userData, categoriesData, postsData }
  }
}
  