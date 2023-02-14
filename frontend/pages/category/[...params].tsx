
import styles from '@/styles/main.module.scss'
import Seo from '../components/Seo'

// Component
import Side from '../components/main/side'
import MainContents from '../components/main/contents'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { setTokenCookie } from '../api/refreshToken'
import { api } from '../services/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useAppDispatch } from '@/store/store'
import { categoriesList } from '@/features/categorySlice'

const MainParams = ({ categoriesData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const dispatch = useAppDispatch();

    const categoryAdd = useMemo(() => dispatch(categoriesList(categoriesData.category)), [])

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
  