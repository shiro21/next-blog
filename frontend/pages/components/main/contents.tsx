import styles from '@/styles/main.module.scss'
import { PostProps } from '@/pages/services/interface';
import { useEffect, useState } from 'react';

// Components
import Post from '../post/post';
import PostLists from '../post/postList';
import { useAppSelector } from '@/store/store';

const MainContents = () => {

    const selector = useAppSelector((state) => state.post);

    const [posts, setPosts] = useState<PostProps[]>([]);
    useEffect(() => {
        setPosts(selector.post);
    }, [selector])

    return (
        <article className={styles.contents_wrap}>
            <h1>전체 글</h1>

            {/* 카테고리 글 박스 */}
            <div className={styles.category_contents}>
                <ul>
                    {
                        posts.length > 0 && posts.map((item: PostProps) => (
                            <PostLists key={item.id} item={item} />
                        ))
                    }
                </ul>
            </div>

            {/* 카테고리 글 */}
            <div className={styles.contents}>
                {
                    posts.length > 0 && posts.map((item: PostProps) => (
                        <Post key={item.id} item={item} />
                    ))
                }
                <h2></h2>
            </div>
        </article>
    );
}

export default MainContents;
