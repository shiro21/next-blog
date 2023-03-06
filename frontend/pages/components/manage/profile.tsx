import { useAppSelector } from '@/store/store';
import styles from '@/styles/manage.module.scss'
import React, { useState } from 'react';

const ProfileManage = () => {

    const selector = useAppSelector(store => store.user);

    const [files, setFiles] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<{file: File | null, imagePreviewUrl: ArrayBuffer | string | null}[]>([]);
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files === null) return;

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setPreview([{ file: file, imagePreviewUrl: reader.result }]);
        }

        reader.readAsDataURL(file);

        setFiles(file);
    }

    return (
        <>
            <div className={styles.profile_wrap}>
                <h2>블로그 설정</h2>
                <div className={styles.profile_box}>
                    <div className={styles.profile_image}>
                        {
                            preview.length > 0 ? <img src={String(preview[0].imagePreviewUrl)} alt={selector.user.id} /> : <img src={selector.user.profile} alt={selector.user.id} />
                        }
                        
                        <input type="file" accept="image/*" onChange={onFileChange} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileManage;