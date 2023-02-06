import styles from '@/styles/manage.module.scss'

const WriteManage = () => {
    return (
        <>
            <div className={styles.category_wrap}>
                <h2>글 관리</h2>
                <div className={styles.category}>
                    <ul>
                        <li>
                            <h5>제목입니다.</h5>
                            <div className={styles.info_wrap}>
                                <div className={styles.category}>Javascript...</div>
                                <div className={styles.profile}>닉네임<span>2023.02.06 13:24</span></div>
                            </div>
                        </li>

                        <li>
                            <h5>제목입니다.</h5>
                            <div className={styles.info_wrap}>
                                <div className={styles.category}>Javascript...</div>
                                <div className={styles.profile}>닉네임<span>2023.02.06 13:24</span></div>
                            </div>
                        </li>

                        <li>
                            <h5>제목입니다.</h5>
                            <div className={styles.info_wrap}>
                                <div className={styles.category}>Javascript...</div>
                                <div className={styles.profile}>닉네임<span>2023.02.06 13:24</span></div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default WriteManage;