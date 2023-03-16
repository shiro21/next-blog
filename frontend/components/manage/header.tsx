import styles from '@/styles/manage.module.scss'
import favi from '@/public/favi.ico'
import Image from 'next/image';

import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { ApiUserProps } from '@/services/apiInterface';
import { removeTokenCookie } from '../login/tokenCookies';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '@/services/api';
import { NotifyProps } from '@/services/interface';
import moment from 'moment';

const ManageHeader = ({ userData }: { userData: ApiUserProps }) => {

    const [notify, setNotify] = useState([]);
    useEffect(() => {
        api.post("/user/notifyFind")
        .then(res => {
            if (res.data.code === "y") setNotify(res.data.data);
        })
        .catch(err => console.log("Notify Find Err", err));
    }, [])
    
    const router = useRouter();
    const { id, email, name, profile } = userData.user;

    const [profileInfo, setProfileInfo] = useState<boolean>(false);
    const [noticeInfo, setNoticeInfo] = useState<boolean>(false);

    useEffect(() => {
        setProfileInfo(false);
        setNoticeInfo(false);
    }, [router.query])

    const logOut = async () => {
        await removeTokenCookie();
        router.push("/");
    }

    const onMove = (item: NotifyProps) => {
        if (item.confirm === false) api.post("/user/notifyConfirm", item);
        
        router.push(`/${item.owner}`);
    }

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
                        <button type="button" className={styles.notice_button} onClick={() => setNoticeInfo(prev => !prev)}>
                            <FontAwesomeIcon icon={faBell} width={24} height={24} />
                        </button>
                        <button type="button" className={styles.profile_button} onClick={() => setProfileInfo(prev => !prev)}>
                            <Image src={profile} style={{borderRadius: "50%", objectFit: "cover"}} width={40} height={40} alt="로고" />
                        </button>

                        {/* 알림 */}
                        {
                            noticeInfo && <div className={styles.notice_wrap}>
                                <h4>새로운 소식</h4>
                                <div className={styles.notice}>
                                    <ul>
                                        {
                                            notify.length > 0 && notify.map((item: NotifyProps, index) => (
                                                <li key={index} style={{background: item.confirm === false ? "#EEE" : ""}}>
                                                    <div style={{flex: "1", paddingRight: ".5rem", cursor: "pointer"}} onClick={() => onMove(item)}>
                                                        {item.comment}<br /><span style={{float: "right"}}>- {item.nick}</span>
                                                        {/* <Link href={`/${item.owner}`}>{item.comment} <span>- {item.nick}</span></Link> */}
                                                    </div>
                                                    <div style={{width: "80px"}}>
                                                        {moment(item.createdAt).format('YYYY-MM-DD')}
                                                    </div>
                                                </li>
                                            ))
                                        }
                                        {/* <li>
                                            <div style={{flex: "1"}}>
                                                닉네임님이 댓글을 남겼습니다.<br />
                                                "항상 잘 보고 있습니다."
                                            </div>
                                            <div style={{width: "80px"}}>
                                                2023.02.03
                                            </div>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                        }
                        

                        {/* 프로필 관련 */}
                        {
                            profileInfo && <div className={styles.profile_wrap}>
                                <div className={styles.profile_name}>
                                    {id}<span style={{paddingLeft: "4px"}}>{name}</span><br />
                                    <span>{email}</span><br />
                                    <button type="button"><Link href={"/manage/profile"}>프로필 변경</Link></button>
                                </div>
                                
                                <button type="button" onClick={logOut}>로그아웃</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ManageHeader;