import React, { ChangeEvent, useEffect, useState } from "react";
import Side from "./components/main/side";
import Seo from "./components/Seo";
import styles from '@/styles/_guest.module.scss'
import { api } from "./services/api";
import { GuestProps } from "./services/interface";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { categoriesList } from "@/features/categorySlice";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { userList } from "@/features/userSlice";

const Guest = ({ userData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    const dispatch = useAppDispatch();
    const postSelector = useAppSelector((state) => state.post);

    const selector = useAppSelector(state => state.user);
    const [guestData, setGuestData] = useState([]);
    const [contents, setContents] = useState("");
    const [secret, setSecret] = useState(false);
    const [nick, setNick] = useState("");

    useEffect(() => {
        dispatch(userList(userData.user));

        if (postSelector.status === "idle") {
            (async () => {
                await api.post("/total/categoryAndPosts")
                .then(res => {
                    if (res.data.code === "y") {
                        dispatch(categoriesList(res.data.categories));
                    }
                })
                .catch(err => console.log("PostsList Find Err", err));

            })()
        }
        api.post("/total/guestFind")
        .then(res => {
            if (res.data.code === "y") setGuestData(res.data.data);
        })
        .catch(err => console.log ("Guest Find Err", err));
    }, [dispatch, postSelector, userData]);

    const onGuestWrite = () => {

        const guest = {
            contents: contents,
            secret: secret,
            nick: nick
        };

        api.post("/total/guestCreate", guest)
        .then(res => {
            if (res.data.code === "y") {
                setContents("");
                setNick("");
                setGuestData(res.data.data);
            }
        })
        .catch(err => console.log("Guest Create Err", err));
    }

    return (
        <>
            <Seo title="?????????" />
  
            <article className={styles.guest_wrap}>
                <Side />
                <div className={styles.guest_contents}>
                    <h2>Guest</h2>
                    <div className={styles.guest_box}>
                        <div className={styles.guest_input_wrap}>
                            <textarea placeholder="??????????????? ?????? ?????? ?????? ??????????????????." value={contents} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContents(e.target.value)} />
                            <div className={styles.guest_button_wrap}>
                                <input type="text" placeholder="???????????? ??????????????????." value={nick} onChange={(e: ChangeEvent<HTMLInputElement>) => setNick(e.target.value)} />
                                <label htmlFor="sec">?????????</label>
                                <input type="checkbox" id="sec" name="sec" checked={secret} onChange={() => setSecret(prev => !prev)} />
                                <button onClick={onGuestWrite}>??? ??????</button>
                            </div>
                        </div>
                        
                        {/* ????????? ?????? */}
                        <div className={styles.guest__}>
                            <ul>
                                {
                                    guestData.length > 0 && guestData.map((item: GuestProps, index) => (
                                        <li key={index}>
                                            <h5>{ item.nick === "" ? "?????????" : item.nick } <span>{moment(item.createdAt).format("YYYY??? MM??? DD??? HH:mm:ss")}</span></h5>
                                            {/* { !item.secret || selector.user._id ? <div className={styles.contents}>{item.contents}</div> : <div className={styles.contents}>???????????? ????????? ????????????.</div> } */}
                                            { !item.secret || Object.keys(selector.user).length > 0 ? <div className={styles.contents}>{item.contents}</div> : <div className={styles.contents}>???????????? ????????? ????????????.</div> }
                                            {
                                                Object.keys(selector.user).length > 0 ? <div className={styles.button_wrap}><button>??????</button></div> : <div style={{height: "2rem", marginBottom: "1rem", borderBottom: "1px solid #DDD"}}></div>
                                            }
                                            
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>

                </div>
            </article>
        </>
    );
}

export default Guest;

export const getServerSideProps: GetServerSideProps = async (context) => {

    const isToken = context.req.cookies["@nextjs-blog-token"] !== undefined ? context.req.cookies["@nextjs-blog-token"] : "";
  
    let userData = { success: false, user: {} };

    if (isToken === "") userData = { success: false, user: {} };
    else {
  
      try {
  
        await api.post("/user/decode", { token: isToken })
        .then(res => {
          if (res.data.code === "y") {
            userData = { success: true, user: res.data.data.user };
          }
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
  