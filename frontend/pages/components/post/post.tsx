import { PostProps } from '@/pages/api/interface';
import styles from '@/styles/_post.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';

// Components
import PostLists from './postList';

const Post = ({item}: { item: PostProps}) => {
    return (
        <section className={styles.contents_item} key={item.id}>
            {/* 제목 */}
            <h2>{item.title}</h2>
            {/* 날짜 */}
            <span className={styles.item_create}>{item.createdAt}</span>
            {/* 태그 */}
            <div className={styles.item_tag}>
                {
                    item.tag.length > 0 && item.tag.map((tag, index) => (
                        <span key={index}>#{tag}</span>
                    ))
                }
            </div>
            {/* 내용 */}
            <div className={styles.item_content}>
                {item.content}
            </div>

            {/* 좋아요 */}
            <div className={styles.item_like}>
                <FontAwesomeIcon icon={faHeartBroken} width={24} height={24} />
                <FontAwesomeIcon icon={faHeart} width={24} height={24} />
                <label htmlFor="heart">1</label>
            </div>

            {/* 카테고리 목록 5개 */}
            <div className={styles.category_list_wrap}>
                <ul>
                    <li><span>"카테고리 이름"</span> 카테고리의 다른 글</li>
                    <PostLists key={item.id} item={item} />
                </ul>
            </div>

            {/* 삭제 수정 */}
            <div className={styles.write_options}>
                <ul>
                    <li>수정</li>
                    <li>삭제</li>
                </ul>
            </div>

            {/* 댓글 */}
            <div className={styles.comments_wrap}>
                <div className={styles.comments_info}>
                    <input type="text" placeholder="닉네임" />
                    <input type="password" placeholder="비밀번호" />
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