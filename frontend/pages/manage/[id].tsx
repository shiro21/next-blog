import styles from '@/styles/manage.module.scss'
import { useRouter } from 'next/router';

// Components
import ManageHeader from "../components/manage/header";
import ManageSide from "../components/manage/side";
import HomeManage from "../components/manage/home";
import Seo from '../components/Seo';
import CategoryManage from '../components/manage/category';
import LinkManage from '../components/manage/link';
import WriteManage from '../components/manage/write';

const Manage = () => {

    const router = useRouter();

    return (
        <>
            <Seo title="관리자" />
            <ManageHeader />

            <article className={styles.manage_wrap}>
                <ManageSide />
                {
                    router.query.id === "home" && <section style={{flex: 1, padding: "1rem"}}>
                        <HomeManage />
                    </section>
                }

                {
                    router.query.id === "category" && <section style={{flex: 1, padding: "1rem"}}>
                        <CategoryManage />
                    </section>
                }

                {
                    router.query.id === "link" && <section style={{flex: 1, padding: "1rem"}}>
                        <LinkManage />
                    </section>
                }

                {
                    router.query.id === "write" && <section style={{flex: 1, padding: "1rem"}}>
                        <WriteManage />
                    </section>
                }
            </article>

            {/* 푸터 시간 남으면 만들기 */}
        </>
    );
};

export default Manage;