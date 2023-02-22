import { postsList } from '@/features/postSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import styles from '@/styles/_tag.module.scss'
import React, { useEffect, useState } from 'react';
import Side from './components/main/side';
import Seo from "./components/Seo";
import { api } from './services/api';
import { PostProps } from './services/interface';

const Tag = () => {

    const dispatch = useAppDispatch();
    const selector = useAppSelector((state) => state.post);

    const [tags, setTags] = useState<string[]>([]);
    
    useEffect(() => {
        
        if (selector.status === "idle") {
            (async () => {
                await api.post("/edit/postsFind")
                .then(res => {
                    if (res.data.code === "y") dispatch(postsList(res.data.data));
                })
                .catch(err => console.log("PostsList Find Err", err));

            })()
        }
        
        let tagArr: string[] = [];
        selector.post.map((item:PostProps) => {
            item.tag.map((t) => {
                tagArr.push(t);
            })
        });

        const newArr = (tagArr: any[]) => tagArr.reduce((x, y) => ({ ...x, [y]: (x[y] || 0) + 1 }), {});
        let arr = newArr(tagArr);
        setTags(arr)
    }, [selector])

    return (
        <>
            <Seo title="제목 들어갈 자리" />
  
            <article className={styles.tag_wrap}>
                <Side />
                <div className={styles.tag_contents}>
                    <h2>Tag</h2>
                    <div className={styles.tag_box}>
                        {
                            Object.entries(tags).length > 0 && Object.entries(tags).map((item, index) => (
                                <React.Fragment key={index}>
                                    {
                                        Number(item[1]) >= 50 && <span style={{fontSize: "2.5rem"}}>{item[0]}</span>
                                    }
                                    {
                                        Number(item[1]) >= 10 && <span style={{fontSize: "2rem"}}>{item[0]}</span>
                                    }
                                    {
                                        Number(item[1]) >= 5 && <span style={{fontSize: "1rem"}}>{item[0]}</span>
                                    }
                                    {
                                        Number(item[1]) >= 1 && <span style={{fontSize: ".8rem"}}>{item[0]}</span>
                                    }
                                </React.Fragment>
                            ))
                        }
                    </div>
                </div>
            </article>
        </>
    );
}

export default Tag;