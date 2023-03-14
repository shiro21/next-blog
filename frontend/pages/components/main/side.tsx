import styles from '@/styles/main.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { CategoryProps, LinkProps, SubCategoryProps, UserProps } from '@/pages/services/interface';

import { useAppSelector } from '@/store/store';
import { api } from '@/pages/services/api';

const Side = () => {

    const [sideNav, setSideNav] = useState<boolean>(false);
    const [categoryWrap, setCategoryWrap] = useState<CategoryProps[]>([]);
    const [linkWrap, setLinkWrap] = useState<LinkProps[]>([]);

    const mobileSideOpen = () => setSideNav(prev => !prev);
    
    const selector = useAppSelector((state) => (state.category));
    const linkSelector = useAppSelector((state) => (state.link));
    // const onSelector = useMemo(() => setCategoryWrap(selector.category), [selector]);
    useEffect(() => {
        setCategoryWrap(selector.category);
        setLinkWrap(linkSelector.link);
    }, [selector, linkSelector]);

    const [globalUser, setGlobalUser] = useState<UserProps | null>(null);
    const [globalBlock, setGlobalBlock] = useState(false);
    const memories = useMemo(() => {

        if (globalBlock === false) {
            api.post("/user/find")
            .then(res => {
                if (res.data.code === "y") {
                    setGlobalUser(res.data.data);
                }
            })
            .catch(err => console.log("User Find Err", err));

            setGlobalBlock(true);
        }
    }, [globalBlock]);

    return (
        <>
            <nav id="nav" className={`${styles.nav} ${ sideNav ? `${styles.nav0}` : ""}`}>
                <h2><Link href={"/"}>{globalUser && globalUser.id}의 블로그</Link></h2>

                {/* 카테고리 */}
                {
                    categoryWrap.length > 0 && categoryWrap.map((item: CategoryProps, index) => (
                        <ul className={styles.nav_category_list} key={index}>
                            <li>
                                <Link href={`/category/${item.name}`}>
                                    {item.name} <span>({item.entries})</span>
                                </Link>
                            </li>
                            {/* Sub */}
                            <ul>
                                {
                                    item.children.length > 0 && item.children.map((sub: SubCategoryProps, subIndex) => (
                                        <li key={subIndex}>
                                            <Link href={`/category/${item.name}/${sub.name}`}>
                                                {sub.name} <span>({sub.entries})</span>
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </ul>
                    ))
                }

                {/* 홈 목록 */}
                <ul className={styles.nav_home_list}>
                    <li><Link href={"/"}>홈</Link></li>
                    <li><Link href={"/tag"}>태그</Link></li>
                    <li><Link href={"/guest"}>방명록</Link></li>
                </ul>

                {/* 나의 URL */}
                <ul className={styles.nav_url_list}>
                    {
                        linkWrap.length > 0 && linkWrap.map((item: LinkProps, index) => (
                            <li key={index}>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">{item.linkName}</a>
                            </li>
                        ))
                    }
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