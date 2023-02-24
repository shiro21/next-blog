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
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useEffect, useState } from 'react';
import { ApiUserProps } from '../services/apiInterface';
import { useAppDispatch } from '@/store/store';
import { userList } from '@/features/userSlice';
import { PostProps, UserAgentProps } from '../services/interface';
import { postsList } from '@/features/postSlice';

const Manage = ({ userData, postsData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const [agent, setAgent] = useState<UserAgentProps[]>([]);

    useEffect(() => {
        api.post("/user/userAgentLoad")
        .then(res => {
            if (res.data.code === "y") setAgent(res.data.data);
        })
        .catch(err => console.log("User Agent Err", err));
    }, [])

    useEffect(() => {
        if (!userData.user._id) router.push("/login");

        dispatch(userList(userData.user));
        dispatch(postsList(postsData.post));
    }, [router])

    return (
        <>
            <Seo title="관리자" />
            {
                userData.user && <ManageHeader userData={userData} />
            }

            <article className={styles.manage_wrap}>
                {
                    userData.user && <ManageSide userData={userData} />
                }
                {
                    router.query.id === "home" && <section style={{flex: 1, padding: "1rem"}}>
                        {
                            agent.length > 0 && <HomeManage agent={agent} />
                        }
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
  
    let userData = { success: false, user: {} };
    let postsData = { success: false, post: [] };

    await api.post("/edit/postsFind")
    .then(res => {
        if (res.data.code === "y") postsData = { success: true, post: res.data.data }
    })
    .catch(err => console.log("PostsList Find Err", err));
  
    if (isToken === "") userData = { success: false, user: {} };
    else {
        try {
          await api.post("/user/decode", { token: isToken })
          .then(res => {
            if (res.data.code === "y") userData = { success: true, user: res.data.data.user };
          })
          .catch(err => console.log("Token Decode Err", err));
        
        } catch (err) {
          console.log(err);
        };
    }
    
    return {
      props: { userData, postsData }
    }
}