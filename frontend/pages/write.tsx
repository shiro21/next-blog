import * as React from 'react';
import dynamic from 'next/dynamic';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { api } from './services/api';
import { setTokenCookie } from './api/refreshToken';
import { categoriesList } from '@/features/categorySlice';
import { useAppDispatch } from '@/store/store';
import { SubCategoryProps } from './services/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

const Editor = dynamic(() => import("@/pages/components/editor/editor"), { ssr: false }); // client 사이드에서만 동작되기 때문에 ssr false로 설정

const Write: NextPage = ({ userData, categoriesData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // state
    const [htmlStr, setHtmlStr] = React.useState<string>('');

    const router = useRouter();
    const dispatch = useAppDispatch();

    const categoryAdd = React.useMemo(() => dispatch(categoriesList(categoriesData.category)), [])

    const [select, setSelect] = React.useState("");
    const [title, setTitle] = React.useState("");
    const [tag, setTag] = React.useState("");
    const [tagData, setTagData] = React.useState<string[]>([]);

    const tagKeyCode = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let key = e.code;
        if (key === "Enter") {
            if (tagData.length > 4) return alert("최대 5개까지 가능합니다.");
            else if (tagData.indexOf(tag) > -1) return alert("이미 있는 태그입니다.");
            setTagData([...tagData, tag])
            setTag("");
        }
    }
    const tagDeleted = (e: string) => {
        for (let i = 0; i < tagData.length; i++) {
            if (tagData[i] === e) {
                setTagData(tagData.filter(tag => tag !== e));
            }
        }
    }

    const [files, setFiles] = React.useState<File | null>(null);
    const [preview, setPreview] = React.useState<{file: File | null, imagePreviewUrl: ArrayBuffer | string | null}[]>([]);
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files === null) return;

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            console.log(typeof reader.result);
            setPreview([{ file: file, imagePreviewUrl: reader.result }]);
        }

        reader.readAsDataURL(file);

        setFiles(file);
    }
    const previewDeleted = () => {
        setPreview([{ file: null, imagePreviewUrl: null }]);
        setFiles(null)
    }

    const onClick = async () => {
        const formData = new FormData();
        console.log(select);
        console.log(title);
        console.log(tagData);
        console.log(htmlStr);
        console.log(files);

        if (select === "" || title === "" || tagData.length === 0 || htmlStr === "" || files === null) return alert("뭔가 하나 빠졌습니다 !!!");

        formData.append("select", select);
        formData.append("title", title);
        for (let i = 0; i < tagData.length; i++) formData.append("tagData", tagData[i]);
        formData.append("edit", htmlStr);
        formData.append("coverImage", files);
        formData.append("owner", userData.user._id);

        await api.post("/edit/create", formData)
        .then(res => {
            if (res.data.code === "y") router.push("/");
        })
        .catch(err => console.log("Write Create Err", err));
    }

    return (
        <>
            <div style={{ width: "800px", margin: "0 auto", marginTop: "2rem" }}>
                {/* 카테고리 */}
                <select value={select} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelect(e.target.value)} style={{ marginBottom: "1rem", width: "150px", fontSize: "1rem", fontWeight: "bold", marginTop: "1rem" }}>
                    <option value={""}>선택해주세요.</option>
                    {
                        categoryAdd.payload.length > 0 && categoryAdd.payload.map((item) => (
                            <React.Fragment key={item.priority}>
                                <option value={item.label}>{item.name}</option>
                                {
                                    item.children.length > 0 && item.children.map((sub: SubCategoryProps) => (
                                        <option key={sub.priority} value={sub.label}>- {sub.name}</option>
                                    ))
                                }
                            </React.Fragment>
                        ))
                    }
                </select>
                {/* 제목 */}
                <div style={{marginBottom: "2rem"}}>
                    <input style={{border: "0", borderBottom: "1px solid #DDD", padding: ".5rem", borderRadius: "0", paddingBottom: "1rem", outline: "none", boxSizing: "content-box", fontSize: "2rem", fontWeight: "600"}} placeholder="제목을 입력해주세요." type="text" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
                </div>
                {/* 태그 */}
                <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", border: "1px solid #DDD", padding: "1rem", marginBottom: "2rem"}}>
                    <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", marginBottom: "1rem", width: "100%"}}>
                        <div style={{fontSize: ".8rem", fontWeight: "600", marginRight: "1rem"}}>태그를 입력해주세요.</div>
                        <input style={{width: "150px"}} type="text" value={tag} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTag(e.target.value)} onKeyPress={tagKeyCode} />
                    </div>
                    <ul style={{display: "flex", flexWrap: "wrap"}}>
                        {
                            tagData.length > 0 && tagData.map((item, index) => (
                                <li key={index} style={{position: "relative", padding: ".5rem 2rem .5rem .5rem", border: "1px solid #DDD", borderRadius: "10px", margin: "0 .5rem .5rem 0"}}>
                                    {item}
                                    <span onClick={() => tagDeleted(item)} style={{position: "absolute", right: ".5rem", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", cursor: "pointer"}}>
                                        <FontAwesomeIcon icon={faDeleteLeft} />
                                    </span>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                {/* 에디터 */}
                <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
                {/* 커버 이미지 */}
                <div>
                    <div>
                        <div>이미지를 선택해주세요.</div>
                        <input type="file" name="image" accept="image/*" onChange={onFileChange} />
                    </div>
                    <div>
                        {
                            preview.length > 0 && <div style={{position: "relative"}}>
                                <span onClick={previewDeleted} style={{position: "absolute", right: ".5rem", top: ".5rem", cursor: "pointer"}}>
                                    <FontAwesomeIcon icon={faDeleteLeft} />
                                </span>
                                {/* <Image unoptimized src={String(preview[0].imagePreviewUrl)} alt="대표 이미지" /> */}
                                <img src={String(preview[0].imagePreviewUrl)} style={{width: "150px", height: "150px"}} alt="대표 이미지" />
                            </div>
                        }
                    </div>
                </div>
                {/* 제출하기 */}
                <button style={{ float: "right", fontSize: "1rem", fontWeight: "bold", marginTop: "1rem" }} onClick={onClick}>등록하기</button>
            </div>

            {/* <div>
                <div>
                    <h2>Editor를 통해 만들어진 html 코드입니다.</h2>
                    <div dangerouslySetInnerHTML={{__html: htmlStr}} />
                </div>

                <div ref={viewContainerRef} />
            </div> */}
        </>
    );
};

export default Write;

export const getServerSideProps: GetServerSideProps = async (context) => {
  
    const isToken = context.req.cookies["@nextjs-blog-token"] !== undefined ? context.req.cookies["@nextjs-blog-token"] : "";
  
    let userData = { success: false, user: null };
    let categoriesData = { success: false, category: [] }
  
    await api.post("/edit/categoryFind")
    .then(res => {
      if (res.data.code === "y") categoriesData = { success: true, category: res.data.data }
    })
    .catch(err => console.log("Category Load Err", err));
  
    if (isToken === "") userData = { success: false, user: null };
    else {
      try {
        await api.post("/user/decode", { token: isToken })
        .then(res => {
          if (res.data.code === "y") {
            setTokenCookie(isToken);
            userData = { success: true, user: res.data.data.user };
          }
        })
        .catch(err => console.log("Token Decode Err", err));
      } catch (err) {
        console.log(err);
      };
    }
    
    return {
      props: { userData, categoriesData }
    }
  }
  