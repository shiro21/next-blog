import { api } from '@/pages/services/api';
import { LinkProps } from '@/pages/services/interface';
import styles from '@/styles/manage.module.scss'
import { ChangeEvent, useEffect, useState } from 'react';

const LinkManage = () => {

    const [listOpen, setListOpen] = useState(false);
    const [link, setLink] = useState("");
    const [linkName, setLinkName] = useState("");
    const [linkList, setLinkList] = useState([]);

    useEffect(() => {
        api.post("/user/linkFind")
        .then(res => {
            if (res.data.code === "y") setLinkList(res.data.data);
            console.log(res.data);
        })
        .catch(err => console.log("Link Find Err", err));
    }, [])

    const linkAdd = () => {

        if (link === "" || link.length <= 1) return alert("링크를 입력해주세요.");

        const linkData = {
            link: link,
            linkName: linkName
        }

        api.post("/user/linkCreate", linkData)
        .then(res => {
            if (res.data.code === "y") setLinkList(res.data.data);

            setLink("");
            setLinkName("");
        })
        .catch(err => console.log("Link Create Err", err));
    }

    const [updateLink, setUpdateLink] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateOpen, setUpdateOpen] = useState("");
    const onUpdate = (item: LinkProps) => {
        api.post("/user/linkUpdate", {updateLink: updateLink, updateName: updateName, _id: item._id})
        .then(res => {
            if (res.data.code === "y") setLinkList(res.data.data);

            setUpdateOpen("");
        })
        .catch(err => console.log ("Link Update Err", err));
    }

    const onDelete = (item: LinkProps) => {
        api.post("/user/linkDelete", {_id: item._id})
        .then(res => {
            if (res.data.code === "y") setLinkList(res.data.data);
        })
        .catch(err => console.log ("Link Delete Err", err));
    }

    return (
        <>
            <div className={styles.link_wrap}>
                <h2>링크 관리</h2>
                <div className={styles.link_contents}>
                    <ul>
                        {
                            linkList.length > 0 && linkList.map((item: LinkProps, index) => (
                                <li key={index}>
                                    {
                                        updateOpen === item._id ? (
                                            <>
                                                <input type="text" placeholder="https:// 링크를 입력해주세요." value={updateLink} onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdateLink(e.target.value)} />
                                                <input type="text" placeholder="링크 이름을 입력해주세요." value={updateName} onChange={(e: ChangeEvent<HTMLInputElement>) => setUpdateName(e.target.value)} />
                                            </>
                                        ) : <a href={item.link} target="_blank" rel="noopener noreferrer">{item.linkName}</a>
                                    }
                                    
                                    {
                                        updateOpen === item._id ? (
                                            <span>
                                                <button onClick={() => setUpdateOpen("")}>취소</button>
                                                <button onClick={() => onUpdate(item)}>완료</button>
                                            </span>
                                        ) : (
                                            <span>
                                                <button onClick={() => setUpdateOpen(item._id)}>수정</button>
                                                <button onClick={() => onDelete(item)}>삭제</button>
                                            </span>
                                        )
                                    }
                                </li>
                            ))
                        }
                    </ul>

                    <ul>
                        {
                            listOpen && <li>
                                <input type="text" placeholder="https:// 링크를 입력해주세요." value={link} onChange={(e: ChangeEvent<HTMLInputElement>) => setLink(e.target.value)} />
                                <input type="text" placeholder="링크 이름을 입력해주세요." value={linkName} onChange={(e: ChangeEvent<HTMLInputElement>) => setLinkName(e.target.value)} />
                                <div>
                                    <button style={{marginRight: "1rem"}} onClick={linkAdd}>생성</button>
                                    <button onClick={() => setListOpen(prev => !prev)}>취소</button>
                                </div>
                            </li>
                        }
                        <li onClick={() => setListOpen(prev => !prev)}>링크 추가하기</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default LinkManage;