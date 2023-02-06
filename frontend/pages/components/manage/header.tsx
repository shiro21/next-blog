import styles from '@/styles/manage.module.scss'
import favi from '@/public/favi.ico'
import Image from 'next/image';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const ManageHeader = () => {
    return (
        <header className={styles.header_wrap}>
            <div className={styles.header_item_wrap}>
                <div className={styles.header_item}>
                    <div className={styles.logo_wrap}>
                        <Link href={"/"}>
                            <Image src={favi} width={60} height={60} alt="로고" />
                        </Link>
                    </div>
                </div>
                <div className={styles.header_item}>
                    <ul>
                        <li><Link href="/">피드</Link></li>
                        <li><Link href="/">스토리</Link></li>
                        <li><Link href="/">스킨</Link></li>
                        <li><Link href="/">포럼</Link></li>
                    </ul>
                </div>
                <div className={styles.header_item}>
                    <div className={styles.button_wrap}>
                        <button type="button" className={styles.write_button}><Link href={"/write"}>글쓰기</Link></button>
                        <button type="button" className={styles.notice_button}>
                            <FontAwesomeIcon icon={faBell} width={24} height={24} />
                        </button>
                        <button type="button" className={styles.profile_button}>
                            <Image src={favi} width={40} height={40} alt="로고" />
                        </button>

                        {/* 알림 */}
                        {/* <div className={styles.notice_wrap}>
                            <h4>새로운 소식</h4>
                            <div className={styles.notice}>
                                <ul>
                                    <li>
                                        <div style={{flex: "1"}}>
                                            닉네임님이 댓글을 남겼습니다.<br />
                                            "항상 잘 보고 있습니다."
                                        </div>
                                        <div style={{width: "80px"}}>
                                            2023.02.03
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div> */}

                        {/* 프로필 관련 */}
                        {/* <div className={styles.profile_wrap}>
                            <div>shiro21</div>
                            <span>junhyeok403@naver.com</span>
                            <div>로그아웃</div>
                        </div> */}

                    </div>
                </div>
            </div>
        </header>
    );
};

export default ManageHeader;