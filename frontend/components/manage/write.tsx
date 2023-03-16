import { useAppSelector } from '@/store/store';
import styles from '@/styles/manage.module.scss'
import moment from 'moment';
import Link from 'next/link';

const WriteManage = () => {

    const selector = useAppSelector(state => state.post);

    return (
        <>
            <div className={styles.category_wrap}>
                <h2>글 관리</h2>
                <div className={styles.category}>
                    <ul>
                        {
                            selector.post.length > 0 && selector.post.map((item, index) => (
                                <li key={index}>
                                    <h5><Link href={`/${item._id}`}>{item.title}</Link></h5>
                                    <div className={styles.info_wrap}>
                                        <div className={styles.cate}>{item.subLabel}</div>
                                        <div className={styles.profile}><span>{moment(item.createdAt).format('YYYY년 MM월 DD일 HH:mm:ss')}</span></div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}

export default WriteManage;