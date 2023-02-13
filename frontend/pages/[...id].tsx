import styles from '@/styles/_post.module.scss'
import Side from './components/main/side';
import Seo from "./components/Seo";
import Post from "./components/post/post";

import { fakedata } from './api/fakeData';
import { setTokenCookie } from './api/refreshToken';
import { api } from './services/api';
import { GetServerSideProps } from 'next';

const PostPage = () => {

    const item = fakedata[0];
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