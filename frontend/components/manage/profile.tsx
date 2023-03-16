import { userList } from '@/features/userSlice';
import { api } from '@/services/api';
import { useAppDispatch, useAppSelector } from '@/store/store';
import styles from '@/styles/manage.module.scss'
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { setTokenCookie } from '../login/tokenCookies';

interface InfoProps {
    _id: string,
    blog_name: string,
    nick_name: string,
    subscribe: string,
    file: string | File | null
}

const ProfileManage = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const selector = useAppSelector(state => state.user);

    // const [files, setFiles] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<{file: File | null, imagePreviewUrl: ArrayBuffer | string | null}[]>([]);
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setPreview([{ file: file, imagePreviewUrl: reader.result }]);
        }

        reader.readAsDataURL(file);

        // setFiles(file);
        setInformation({...information, file: file})
    }

    const [information, setInformation] = useState<InfoProps>({
        _id: selector.user._id,
        blog_name: selector.user.id,
        nick_name: selector.user.name,
        subscribe: selector.user.subscribe,
        file: selector.user.profile
    });

    const onUpdate = async () => {

        const formData = new FormData();

        formData.append("_id", information._id);
        formData.append("blog_name", information.blog_name);
        formData.append("nick_name", information.nick_name);
        formData.append("subscribe", information.subscribe);
        if (information.file) formData.append("file", information.file);

        await api.post("/user/update", formData)
        .then(async res => {
            if (res.data.code === "y") {
                console.log(res.data.data);
                dispatch(userList(res.data.data));
                await setTokenCookie(res.data.token);

                router.push("/manage/home");
            }
        })
        .catch(err => console.log("Update Err", err));
    }

    return (
        <>
            <div className={styles.profile_wrap}>
                <h2>블로그 설정</h2>
                <div className={styles.profile_box}>
                    <div className={styles.profile_image}>
                        <div style={{position: "absolute", width: "300px", height: "100%", left: "50%", transform: "translateX(-50%)"}}>
                            {
                                preview.length > 0 ? <Image src={String(preview[0].imagePreviewUrl) ? String(preview[0].imagePreviewUrl) : selector.user.id} alt={selector.user.id} layout="fill" /> : <Image src={selector.user.profile} alt={selector.user.id} layout="fill" />
                            }
                        </div>
                        
                        <input type="file" accept="image/*" onChange={onFileChange} />
                        <div className={styles.profile_text_box}>
                            Image
                        </div>
                    </div>
                    <div className={styles.profile_information_box}>
                        <div className={styles.info_input_wrap}>
                            <h4>블로그 이름</h4>
                            <input type="text" value={information.blog_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setInformation({...information, blog_name: e.target.value})} />
                        </div>

                        <div className={styles.info_input_wrap}>
                            <h4>닉네임</h4>
                            <input type="text" value={information.nick_name} onChange={(e: ChangeEvent<HTMLInputElement>) => setInformation({...information, nick_name: e.target.value})} />
                        </div>

                        <div className={styles.info_input_wrap}>
                            <h4>블로그 설명</h4>
                            <textarea value={information.subscribe} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInformation({...information, subscribe: e.target.value})} />
                        </div>

                        <div className={styles.button_wrap}>
                            <button onClick={onUpdate}>업데이트!</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileManage;