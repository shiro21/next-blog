import styles from '@/styles/_post.module.scss'
import Side from './components/main/side';
import Seo from "./components/Seo";
import Post from "./components/post/post";

import { fakedata } from './api/fakeData';
import { setTokenCookie } from './api/refreshToken';
import { api } from './services/api';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useAppDispatch } from '@/store/store';
import { useMemo } from 'react';
import { categoriesList } from '@/features/categorySlice';

const PostPage = ({ categoriesData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const dispatch = useAppDispatch();
  const item = fakedata[0];

  const categoryAdd = useMemo(() => dispatch(categoriesList(categoriesData.category)), [])
  
  return (
      <>
          <Seo title="제목 들어갈 자리" />

          <article className={styles.post_wrap}>
              <Side />
              <div className={styles.post_contents}>
                  <Post item={item} />
              </div>
          </article>
      </>
  );
}

export default PostPage;

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
