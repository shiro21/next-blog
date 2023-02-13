
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
        console.log(router.query.params)
        if (router.query.params === undefined) return;

        setTitle(router.query.params[router.query.params.length - 1]);
    }, [router]);


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