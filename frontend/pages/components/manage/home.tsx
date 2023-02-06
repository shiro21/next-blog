import styles from '@/styles/manage.module.scss'
import Image from 'next/image';
import Link from 'next/link';
import Chart from './chartjs';
import favi from '@/public/favi.ico'

const HomeManage = () => {
    return (
        <>
            <div className={styles.box_wrap}>
                <div className={styles.top_box}>
                    <dl>
                        <dt>오늘 방문자</dt>
                        <dd>10</dd>
                    </dl>

                    <dl>
                        <dt>어제 방문자</dt>
                        <dd>10</dd>
                    </dl>

                    <dl>
                        <dt>누적 방문자</dt>
                        <dd>20</dd>
                    </dl>
                </div>

                <div className={styles.mid_box}>
                    <Chart />
                </div>

                <div className={styles.bottom_box}>
                    <div className={styles.box_left}>
                        <h5>최근 7일 통계</h5>
                        <h6>인기 글</h6>
                        <ul>
                            <li><Link href={"/"}><span>1.</span> 글 제목</Link></li>
                            <li><Link href={"/"}><span>2.</span> 글 제목</Link></li>
                            <li><Link href={"/"}><span>3.</span> 글 제목</Link></li>
                        </ul>
                    </div>
                    <div className={styles.box_right}>
                        <div className={styles.box_top}>
                            <h6>유입</h6>
                            <ul>
                                <li>검색</li>
                                <li>SNS</li>
                                <li>기타</li>
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
                        {/* li 내부에 이미지, 제목 들어가야함 */}
                        <li>
                            <div className={styles.card_image}>
                                <Image src={favi} alt="이미지" />
                            </div>
                            <div className={styles.card_title}>제목입니다.</div>
                        </li>
                        <li>
                            <div className={styles.card_image}>
                                <Image src={favi} alt="이미지" />
                            </div>
                            <div className={styles.card_title}>제목입니다.</div>
                        </li>
                        <li>
                            <div className={styles.card_image}>
                                <Image src={favi} alt="이미지" />
                            </div>
                            <div className={styles.card_title}>제목입니다.</div>
                        </li>
                        <li>
                            <div className={styles.card_image}>
                                <Image src={favi} alt="이미지" />
                            </div>
                            <div className={styles.card_title}>제목입니다.</div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default HomeManage;