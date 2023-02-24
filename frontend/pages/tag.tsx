import { categoriesList } from '@/features/categorySlice';
import { useAppDispatch } from '@/store/store';
import styles from '@/styles/_tag.module.scss'
import React, { useEffect, useState } from 'react';
import Side from './components/main/side';
import Seo from "./components/Seo";
import { api } from './services/api';
import { PostProps } from './services/interface';

const Tag = () => {

    const dispatch = useAppDispatch();

    const [tags, setTags] = useState<string[]>([]);
    
    useEffect(() => {
        
        let posts: PostProps[] = [];

        (async () => {
            await api.post("/total/categoryAndPosts")
            .then(res => {
                if (res.data.code === "y") {
                    posts = res.data.posts;
                    dispatch(categoriesList(res.data.categories));

                    let tagArr: string[] = [];
                    posts.map((item:PostProps) => {
                        item.tag.map((t) => {
                            tagArr.push(t);
                        })
                    });
            
                    // 중복 태그 점수주기
                    const newArr = (tagArr: any[]) => tagArr.reduce((x, y) => ({ ...x, [y]: (x[y] || 0) + 1 }), {});
                    let arr = newArr(tagArr);
                    setTags(arr);
                }
            })
            .catch(err => console.log("PostsList Find Err", err));

        })()
        

    }, [])

    return (
        <>
            <Seo title="태그" />
  
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