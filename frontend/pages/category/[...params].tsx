
import styles from '@/styles/main.module.scss'
import Seo from '../components/Seo'

// Component
import Side from '../components/main/side'
import MainContents from '../components/main/contents'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const MainParams = () => {

    const router = useRouter();
    const [title, setTitle] = useState("");
    useEffect(() => {
        if (router.query.params === undefined) return;
        setTitle(router.query.params[0]);
    }, [router]);

    console.log(router.query)

    return (
        <>
            <Seo title={title} />
            <main className={styles.main}>
                <Side />
                <MainContents />
            </main>
        </>
    );
}

export default MainParams;