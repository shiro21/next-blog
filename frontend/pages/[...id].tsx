import styles from '@/styles/_post.module.scss'
import Side from './components/main/side';
import Seo from "./components/Seo";
import Post from "./components/post/post";

import { setTokenCookie } from './api/refreshToken';
import { api } from './services/api';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useAppDispatch } from '@/store/store';
import { useEffect, useState } from 'react';
import { categoriesList } from '@/features/categorySlice';
import { postsList } from '@/features/postSlice';
import { PostProps } from './services/interface';
import { useRouter } from 'next/router';

const PostPage = ({ categoriesData, postsData, userAgent, isMobile }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [post, setPost] = useState<PostProps | null>(null);

  useEffect(() => {
    // 개발자모드에서 StrictMode라서 두번 실행되는점.
    if (router.query.id === undefined) return;
    const writeId = router.query.id[0];

    setPost(postsData.post.find((item: PostProps) => item._id === writeId));

    const info = {
      write: writeId,
      userAgent: userAgent["user-agent"],
      isMobile: isMobile
    }
    api.post("/user/userAgent", info);

    dispatch(categoriesList(categoriesData.category));
    dispatch(postsList(postsData.post));
  }, [])

  // useEffect(() => {
  //   console.log("이것도 두번 ?");

  // }, []);
  
  return (
      <>
          <Seo title="제목 들어갈 자리" />

          <article className={styles.post_wrap}>
              <Side />
              <div className={styles.post_contents}>
                {
                  post && <Post item={post} />
                }
              </div>
          </article>
      </>
  );
}

export default PostPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  
  const isToken = context.req.cookies["@nextjs-blog-token"] !== undefined ? context.req.cookies["@nextjs-blog-token"] : "";

  // userAgent 여기서만 실행하기
  const userAgent = context.req.headers;

  const isMobile = Boolean(userAgent["user-agent"]?.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i));

  let userData = { success: false, user: {} };
  let categoriesData = { success: false, category: [] };
  let postsData = { success: false, post: [] };

  try {
    await api.post("/total/categoryAndPosts")
    .then(res => {
      if (res.data.code === "y") {
        categoriesData = { success: true, category: res.data.categories }
        postsData = { success: true, post: res.data.posts }
      }
    })
    .catch(err => console.log("Category Load Err", err));
  } catch (err) {
    console.log(err);
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
    props: { userData, categoriesData, postsData, userAgent, isMobile }
  }
}
