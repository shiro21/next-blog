import { CommentProps, PostProps, UserProps } from '@/pages/services/interface';
import styles from '@/styles/_post.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

// Components
import PostLists from './postList';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { api } from '@/pages/services/api';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useRouter } from 'next/router';
import { postsList } from '@/features/postSlice';
import { categoriesList } from '@/features/categorySlice';

const Post = ({ item }: { item: PostProps }) => {

    const selector = useAppSelector((state) => state.post);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const userData = useAppSelector((state) => state.user.user);
    const [user, setUser] = useState<UserProps | null>(null);
    const [listData, setListData] = useState<PostProps[] | undefined>([]);

    useEffect(() => {
        setUser(userData);
        // console.log(selector.post.filter((post, index) => post.subLabel === item.subLabel));
        // setListData((prev: any) => [...prev.slice(-4), selector.post.filter((post, index) => post.subLabel === item.subLabel)]);
        setListData(selector.post.filter((post, index) => post.subLabel === item.subLabel).slice(-5));
    }, [])

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

    const postDeleted = () => {
        api.post("/edit/deleted", {_id: item._id})
        .then(res => {
            if (res.data.code === "y") {
                dispatch(postsList(res.data.posts));
                dispatch(categoriesList(res.data.categories));
            }
        })
        .catch(err => console.log("Deleted Err", err));
    }

    const [comments, setComments] = useState({ nick: "", password: "", comment: "", secret: false, owner: item._id });
    const [commentWrap, setCommentWrap] = useState([]);
    const onComment = async () => {

        if (item.owner.id === comments.nick && !user) return alert("관리자의 닉네임은 사용할 수 없습니다.");
        else if (comments.nick === "" || comments.password === "" && !user) return alert("아이디와 비밀번호를 확인해주세요.");
        else if (comments.comment === "") return alert("내용을 입력해주세요.");

        await api.post("/edit/commentCreate", comments)
        .then(res => {
            if (res.data.code === "y") {
                setCommentWrap(res.data.data);
                setComments({ nick: "", password: "", comment: "", secret: false, owner: item._id });
            }
        })
        .catch(err => console.log("Comment Create Err", err));
    }

    const [commentDel, setCommentDel] = useState("");
    const [commentPassword, setCommentPassword] = useState("");

    useEffect(() => {
        api.post("/edit/commentFind", { owner: item._id })
        .then(res => {
            if(res.data.code === "y") setCommentWrap(res.data.data);
        })
        .catch(err => console.log("Comment Find Err", err));
    }, []);

    const onDeleted = async (item: CommentProps) => {
        
        await api.post("/edit/commentDelete", { _id: item._id, password: commentPassword, owner: item.owner })
        .then(res => {
            if(res.data.code === "y") setCommentWrap(res.data.data);
            else if (res.data.code === "password") return alert(res.data.message);
        })
        .catch(err => console.log("Comment Deleted Err", err));
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
                    item && item.tag.map((tag, index) => (
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

                    {
                        listData && listData.map((item, index) => (
                            <PostLists key={index} item={item} />
                        ))
                    }
                    
                </ul>
            </div>

            {/* 삭제 수정 */}
            {
                userData._id && <div className={styles.write_options}>
                    <ul>
                        <li onClick={() => router.push({ pathname: "/write", query: {post: JSON.stringify(item)}}, "/write")}>수정</li>
                        <li onClick={postDeleted}>삭제</li>
                    </ul>
                </div>
            }
            

            {/* 댓글 */}
            <div className={styles.comments_wrap}>
                <div className={styles.comments_info}>
                    <input type="text" value={comments.nick} onChange={(e:ChangeEvent<HTMLInputElement>) => setComments({...comments, nick: e.target.value})} placeholder="닉네임" autoComplete="off" />
                    <input type="password" value={comments.password} onChange={(e:ChangeEvent<HTMLInputElement>) => setComments({...comments, password: e.target.value})} placeholder="비밀번호" autoComplete="off" />
                </div>
                <textarea value={comments.comment} onChange={(e:ChangeEvent<HTMLTextAreaElement>) => setComments({...comments, comment: e.target.value})} />
                
                <div className={styles.comments_button_wrap}>
                    <label htmlFor="secret">비밀글</label>
                    <input type="checkbox" checked={comments.secret} onChange={(e: ChangeEvent<HTMLInputElement>) => {setComments({...comments, secret: e.target.checked})}} id="secret" name="secret" />

                    <button type="button" onClick={onComment}>확인</button>
                </div>

            </div>
            {/* 댓글 */}
            <div className={styles.comments_list_wrap}>
                <ul>
                    {
                        commentWrap.length > 0 && commentWrap.map((item: CommentProps, index) => (
                            <React.Fragment key={index}>
                                <li>
                                    <div className={styles.comments_info}>{item.nick} <span>{moment(item.createdAt).format('YYYY년 MM월 DD일 HH:mm:ss')}</span></div>
                                    <div className={styles.comments}>{item.secret ? "비밀글입니다~!" : item.comment}</div>
                                    <div className={styles.comments_control}>
                                        {/* 관리자 닉네임은 사용하지 못하도록 설정하기 ( 관리자만 사용가능하도록 ) */}
                                        <button onClick={() => setCommentDel(item._id)}>삭제</button>
                                        {
                                            commentDel === item._id && <div style={{display: "flex", margin: "1rem 0"}}>
                                                <input placeholder="비밀번호를 입력해주세요." type="password" style={{width: "100%", marginRight: ".5rem"}} value={commentPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setCommentPassword(e.target.value)} />
                                                <button style={{marginRight: "1rem", whiteSpace: "nowrap"}} onClick={() => setCommentDel("")}>취소</button>
                                                <button style={{whiteSpace: "nowrap"}} onClick={() => onDeleted(item)}>삭제</button>
                                            </div>
                                        }
                                    </div>
                                </li>
                            </React.Fragment>
                        ))
                    }
                </ul>
            </div>
        </section>
    );
}

export default Post;