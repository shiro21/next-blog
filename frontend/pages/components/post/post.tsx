import { PostProps, UserProps } from '@/pages/services/interface';
import styles from '@/styles/_post.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

// Components
import PostLists from './postList';
import { ChangeEvent, useEffect, useState } from 'react';
import { api } from '@/pages/services/api';
import { useAppSelector } from '@/store/store';
import { useRouter } from 'next/router';

const Post = ({ item }: { item: PostProps }) => {

    const router = useRouter();

    const userData = useAppSelector((state) => state.user.user);
    const [user, setUser] = useState<UserProps | null>(null);

    useEffect(() => setUser(userData), [])

    const [likeName, setLikeName] = useState("");
    const [like, setLike] = useState<number | null>(null);

    const onLikeClick = () => {
        if (likeName === "" || likeName.length < 2) return alert("닉네임을 2글자 이상 입력해주세요.");
        
        api.post("/like/like", { name: likeName, _id: item._id })
        .then(res => {
            if (res.data.code === "y") setLike(res.data.data.length);
            else if (res.data.code === "n") return alert(res.data.message);
        })
        .catch(err => console.log("Like Update Err", err));
    }
    return (
        <section className={styles.contents_item}>
            {/* 제목 */}
            <h2>{item.title}</h2>
            {/* 날짜 */}
            <span className={styles.item_create}>{moment(item.createdAt).format('YYYY년 MM월 DD일 HH:mm:ss')}</span>
            {/* 태그 */}
            <div className={styles.item_tag}>
                {
                    item.tag.length > 0 && item.tag.map((tag, index) => (
                        <span key={index}>#{tag}</span>
                    ))
                }
            </div>
            {/* 내용 */}
            <div className={styles.item_content} dangerouslySetInnerHTML={{__html: item.edit}} />

            {/* 좋아요 */}
            <div className={styles.item_like}>
                {/* <span>
                    <FontAwesomeIcon icon={faHeartBroken} width={24} height={24} />
                </span> */}
                <span onClick={onLikeClick}>
                    <FontAwesomeIcon icon={faHeart} width={24} height={24} />
                </span>
                {
                    like !== null && <label htmlFor="heart">{like}</label>
                }
                <input type="text" value={likeName} onChange={(e: ChangeEvent<HTMLInputElement>) => setLikeName(e.target.value)} />
            </div>

            {/* 카테고리 목록 5개 */}
            <div className={styles.category_list_wrap}>
                <ul>
                    <li><span>"{item.subLabel}"</span> 카테고리의 다른 글</li>
                    <PostLists item={item} />
                </ul>
            </div>

            {/* 삭제 수정 */}
            {
                user && <div className={styles.write_options}>
                    <ul>
                        <li onClick={() => router.push({ pathname: "/write", query: {post: JSON.stringify(item)}}, "/write")}>수정</li>
                        <li>삭제</li>
                    </ul>
                </div>
            }
            

            {/* 댓글 */}
            <div className={styles.comments_wrap}>
                <div className={styles.comments_info}>
                    <input type="text" placeholder="닉네임" autoComplete="off" />
                    <input type="password" placeholder="비밀번호" autoComplete="off" />
                </div>
                <textarea />
                
                <div className={styles.comments_button_wrap}>
                    <label htmlFor="secret">비밀글</label>
                    <input type="checkbox" id="secret" name="secret" />

                    <button type="button">확인</button>
                </div>

            </div>
            {/* 댓글 */}
            <div className={styles.comments_list_wrap}>
                <ul>
                    <li>
                        <div className={styles.comments_info}>이름 <span>2023.02.06 10:10</span></div>
                        <div className={styles.comments}>댓글 내용입니다.</div>
                        <div className={styles.comments_control}>
                            {/* 관리자 닉네임은 사용하지 못하도록 설정하기 ( 관리자만 사용가능하도록 ) */}
                            <button>삭제</button>
                            <button>답글</button>
                        </div>
                    </li>

                    <li>
                        <div className={styles.comments_info}>이름 <span>2023.02.06 10:10</span></div>
                        <div className={styles.comments}>댓글 내용입니다.</div>
                        <div className={styles.comments_control}>
                            {/* 관리자 닉네임은 사용하지 못하도록 설정하기 ( 관리자만 사용가능하도록 ) */}
                            {/* 삭제는 비밀번호 입력하기 */}
                            <button>삭제</button>
                            <button>답글</button>
                        </div>
                    </li>
                </ul>
            </div>
        </section>
    );
}

export default Post;