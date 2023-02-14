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
import { api } from '../services/api';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { ApiUserProps } from '../services/apiInterface';
import { setTokenCookie } from '../api/refreshToken';

const Manage = ({ userData }: { userData: ApiUserProps}) => {

    const router = useRouter();

    useEffect(() => {
        if (!userData.success) router.push("/login");
    }, [router])

    return (
        <>
            <Seo title="관리자" />
            {
                userData.success && <ManageHeader userData={userData} />
            }

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  
    const isToken = context.req.cookies["@nextjs-blog-token"] !== undefined ? context.req.cookies["@nextjs-blog-token"] : "";
  
    let userData = { success: false, user: null };
  
    if (isToken === "") userData = { success: false, user: null };
    else {
        try {
          await api.post("/user/decode", { token: isToken })
          .then(res => {
            setTokenCookie(isToken);
            if (res.data.code === "y") userData = { success: true, user: res.data.data.user };
          })
          .catch(err => console.log("Token Decode Err", err));
        
        } catch (err) {
          console.log(err);
        };
    }
    
    return {
      props: { userData }
    }
}