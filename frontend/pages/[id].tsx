import styles from '@/styles/_post.module.scss'
import Side from './components/main/side';
import Seo from "./components/Seo";
import Post from "./components/post/post";

import { fakedata } from './api/fakeData';

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