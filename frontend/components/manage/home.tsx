import styles from '@/styles/manage.module.scss'
import Image from 'next/legacy/image';
import Link from 'next/link';
import Chart from './chartjs';
import favi from '@/public/favi.ico'
import { PostProps, UserAgentProps } from '@/services/interface';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { api } from '@/services/api';

const HomeManage = ({ agent }: { agent: UserAgentProps[] }) => {

    const [todayData, setTodayData] = useState<UserAgentProps[]>(agent);
    const [yesterdayData, setYesterdayData] = useState<UserAgentProps[]>(agent);

    const [recentlyData, setRecentlyData] = useState([]);
    const [popularData, setPopularData] = useState([]);
    useEffect(() => {

        const today = moment().format('YYYY-MM-DD');
        const yesterday = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD')
        
        setTodayData(agent.filter(data => moment(data.updatedAt).format('YYYY-MM-DD') === today))
        setYesterdayData(agent.filter(data => moment(data.updatedAt).format('YYYY-MM-DD') === yesterday))

        api.post("/edit/statistics")
        .then(res => {
            if (res.data.code === "y") {
                setRecentlyData(res.data.recent);
                setPopularData(res.data.popular);
            }
        })
        .catch(err => console.log("Statistics Err", err));

    }, [agent]);

    return (
        <>
            <div className={styles.box_wrap}>
                <div className={styles.top_box}>
                    <dl>
                        <dt>오늘 방문자</dt>
                        <dd>{todayData.length}</dd>
                    </dl>

                    <dl>
                        <dt>어제 방문자</dt>
                        <dd>{yesterdayData.length}</dd>
                    </dl>

                    <dl>
                        <dt>누적 방문자</dt>
                        <dd>{agent.length}</dd>
                    </dl>
                </div>

                <div className={styles.mid_box}>
                    <Chart agent={agent} />
                </div>

                <div className={styles.bottom_box}>
                    <div className={styles.box_left}>
                        <h5>최근 7일 통계</h5>
                        <h6>인기 글</h6>
                        <ul>
                            {
                                recentlyData && recentlyData.map((item: PostProps, index) => (
                                    <li key={index}>
                                        <Link href={`/${item._id}`}><span>{index + 1}.</span> {item.title}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <div className={styles.box_right}>
                        <div className={styles.box_top}>
                            <h6>유입</h6>
                            <ul>
                                <li>PC: {agent.filter(data => data.isMobile === false).length}</li>
                                <li>Mobile: {agent.filter(data => data.isMobile === true).length}</li>
                            </ul>
                        </div>
                        <div className={styles.box_bottom}>
                            <h6>키워드</h6>
                            <ul>
                                <li>유입 키워드 내용</li>
                                <li>유입 키워드 내용</li>
                                <li>유입 키워드 내용</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.rest_box}>
                    <h5>최근 글</h5>
                    <ul>
                        {
                            popularData && popularData.map((item: PostProps, index) => (
                                <li key={index}>
                                    <Link href={`/${item._id}`}>
                                        <div className={styles.card_image}>
                                            <Image src={item.coverImage} alt={item.title} layout="fill" />
                                        </div>
                                        <div className={styles.card_title}>{item.title}</div>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </>
    );
};

export default HomeManage;