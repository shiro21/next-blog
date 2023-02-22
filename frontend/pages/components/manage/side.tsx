import styles from '@/styles/manage.module.scss'
import Image from 'next/image';

import favi from '@/public/favi.ico'
import Link from 'next/link';
import { ApiUserProps } from '@/pages/services/apiInterface';

const ManageSide = ({ userData }: { userData: ApiUserProps }) => {
    return (
        <nav className={styles.side_wrap}>
            <div className={styles.side_profile_wrap}>
                <Image src={userData.user.profile} alt="프로필" width={250} height={250} />
                <div>
                    <h4>{userData.user.id}</h4>
                    <h5>{userData.user.name}</h5>
                </div>
            </div>

            <div className={styles.side_contents}>
                <ul>
                    <li><Link href={"/manage/home"}>블로그 홈</Link></li>
                </ul>

                <ul>
                    <li style={{fontWeight: "bold"}}>콘텐츠</li>
                    <li><Link href={"/manage/category"}>카테고리 관리</Link></li>
                    <li><Link href={"/manage/link"}>링크</Link></li>
                    <li><Link href={"/manage/write"}>글 관리</Link></li>
                    <li>방문통계</li>
                </ul>
            </div>
        </nav>
    );
};

export default ManageSide;