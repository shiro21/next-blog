import styles from '@/styles/main.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Side = () => {
    
    const [sideNav, setSideNav] = useState<boolean>(false);

    const mobileSideOpen = () => setSideNav(prev => !prev);
    

    return (
        <>
            <nav id="nav" className={`${styles.nav} ${ sideNav ? `${styles.nav0}` : ""}`}>
                <h2><Link href={"/"}>블로그 제목</Link></h2>

                {/* 카테고리 */}
                <ul className={styles.nav_category_list}>
                    <li><Link href="/">HTML | CSS(10)</Link></li>
                    <li>
                        <Link href="/">Javascript</Link>
                        <ul>
                            <li><Link href="/category/1">Javascript 자식</Link></li>
                            <li><Link href="/category/2">Javascript 자식</Link></li>
                            <li><Link href="/category/3">Javascript 자식</Link></li>
                        </ul>
                    </li>
                    <li><Link href="/">React</Link></li>
                    <li><Link href="/">Angular</Link></li>
                    <li><Link href="/">Vue</Link></li>
                </ul>

                {/* 홈 목록 */}
                <ul className={styles.nav_home_list}>
                    <li>홈</li>
                    <li>태그</li>
                    <li>방명록</li>
                </ul>

                {/* 나의 URL */}
                <ul className={styles.nav_url_list}>
                    <li>내 리스트</li>
                    <li>내 리스트</li>
                    <li>내 리스트</li>
                </ul>

                <div>
                    검색 관련..할까 말까
                </div>
            </nav>
            <button onClick={mobileSideOpen} className={styles.side_button_wrap} type="button">
                <FontAwesomeIcon width={24} height={24} icon={faBars} />
            </button>
        </>
    );
}

export default Side;