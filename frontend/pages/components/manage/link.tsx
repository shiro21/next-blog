import styles from '@/styles/manage.module.scss'

const LinkManage = () => {
    return (
        <>
            <div className={styles.link_wrap}>
                <h2>링크 관리</h2>
                <div className={styles.link_contents}>
                    <ul>
                        <li>GitHub
                            <span>
                                <button>수정</button>
                                <button>삭제</button>
                            </span>
                        </li>
                        <li>포트폴리오
                            <span>
                                <button>수정</button>
                                <button>삭제</button>
                            </span>
                        </li>
                    </ul> 
                </div>
            </div>
        </>
    );
}

export default LinkManage;