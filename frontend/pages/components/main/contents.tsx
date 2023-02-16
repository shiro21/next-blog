import styles from '@/styles/main.module.scss'
import { PostProps } from '@/pages/services/interface';
import React, { useEffect, useState } from 'react';

// Components
import Post from '../post/post';
import PostLists from '../post/postList';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/router';

const MainContents = () => {

    const selector = useAppSelector((state) => state.post);
    const router = useRouter();

    const [posts, setPosts] = useState<PostProps[]>([]);
    useEffect(() => {

        // 빈 오브젝트인지 판단하기
        if (Object.keys(router.query).length === 1) {
            selector.post.find((item) => item.label === router.query[0])

            setPosts(selector.post);
        } else if (Object.keys(router.query).length === 2) {
            selector.post.find((item) => item.label === `${router.query[0]}/${router.query[1]}`)

            setPosts(selector.post);
        } else {
            setPosts(selector.post);
        }
    }, [selector])


    return (
        <article className={styles.contents_wrap}>
            <h1>전체 글</h1>

            {/* 카테고리 글 박스 */}
            <div className={styles.category_contents}>
                <ul>
                    {
                        posts.length > 0 && posts.map((item: PostProps) => (
                            <React.Fragment key={item._id}>
                                <PostLists item={item} />
                            </React.Fragment>
                        ))
                    }
                </ul>
            </div>

            {/* 카테고리 글 */}
            <div className={styles.contents}>
                {
                    posts.length > 0 && posts.map((item: PostProps) => (
                        <React.Fragment  key={item._id}>
                            <Post item={item} />
                        </React.Fragment>
                    ))
                }
                <h2></h2>
            </div>
        </article>
    );
}

export default MainContents;
