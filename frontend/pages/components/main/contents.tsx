import styles from '@/styles/main.module.scss'
import { fakedata } from '@/pages/api/fakeData';
import { PostProps } from '@/pages/services/interface';
import { useEffect } from 'react';
import { postsList } from '@/features/postSlice';

// Components
import Post from '../post/post';
import PostLists from '../post/postList';
import { useAppDispatch } from '@/store/store';

const MainContents = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(postsList(fakedata));
    }, [])

    return (
        <article className={styles.contents_wrap}>
            <h1>전체 글</h1>

            {/* 카테고리 글 박스 */}
            <div className={styles.category_contents}>
                <ul>
                    {
                        fakedata.length > 0 && fakedata.map((item: PostProps) => (
                            <PostLists key={item.id} item={item} />
                        ))
                    }
                </ul>
            </div>

            {/* 카테고리 글 */}
            <div className={styles.contents}>
                {
                    fakedata.length > 0 && fakedata.map((item: PostProps) => (
                        <Post key={item.id} item={item} />
                    ))
                }
                <h2></h2>
            </div>
        </article>
    );
}

export default MainContents;