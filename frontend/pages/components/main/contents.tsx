import styles from '@/styles/main.module.scss'
import { PostProps } from '@/pages/services/interface';
import React, { ChangeEvent, useEffect, useState } from 'react';

// Components
import Post from '../post/post';
import PostLists from '../post/postList';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

const MainContents = () => {

    const selector = useAppSelector((state) => state.post);
    const userSelector = useAppSelector((state) => state.user);
    const router = useRouter();

    const [posts, setPosts] = useState<PostProps[]>([]);
    const [postList, setPostList] = useState<PostProps[]>([]);
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

        setPostList(selector.post.slice(-10));
    }, [selector])

    const [login, setLogin] = useState("");
    const onLogin = () => {
        if (login === "login") router.push("/login");
        else alert("패스워드를 입력해주세요.");
    }


    return (
        <article className={styles.contents_wrap}>
            {
                userSelector.user && <div className={styles.contents_profile} onClick={() => router.push("/manage/home")}>
                    <Image src={userSelector.user.profile ? userSelector.user.profile : "/profile.jpg"} alt={userSelector.user.id || "이미지"} width={40} height={40} />
                </div>
            }
            {
                !userSelector.user && <div className={styles.contents_login}>
                    <input type="text" value={login} onChange={(e: ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)} />
                    <span onClick={onLogin}>Login</span>
                </div>
            }
            
            <h1>전체 글</h1>

            {/* 카테고리 글 박스 */}
            <div className={styles.category_contents}>
                <ul>
                    {
                        postList.length > 0 && postList.map((item: PostProps) => (
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
