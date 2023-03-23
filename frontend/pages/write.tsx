import * as React from 'react';
import dynamic from 'next/dynamic';
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next';
import { api, formApi } from '../services/api';
// import { categoriesList } from '@/features/categorySlice';
// import { useAppDispatch } from '@/store/store';
import { CategoryProps, PostProps, SubCategoryProps } from '../services/interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Image from 'next/legacy/image';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage, storageRef, _uuid } from '@/services/firebase';

const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false }); // client 사이드에서만 동작되기 때문에 ssr false로 설정

const Write: NextPage = ({ userData, categoriesData }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    // state
    const [htmlStr, setHtmlStr] = React.useState<string>('');

    const router = useRouter();
    // const dispatch = useAppDispatch();

    // const categoryAdd = React.useMemo(() => dispatch(categoriesList(categoriesData.category)), [])

    const [select, setSelect] = React.useState("선택해주세요.");
    const [title, setTitle] = React.useState("");
    const [tag, setTag] = React.useState("");
    const [tagData, setTagData] = React.useState<string[]>([]);
    const [postData, setPostData] = React.useState<string | null>(null);
    // const [prevFile, setPrevFile] = React.useState<string | null>(null);

    const [submit, setSubmit] = React.useState("등록하기");
    const [oldFile, setOldFile] = React.useState<string | null>(null);
    React.useEffect(() => {
        if (router.query.post !== undefined) {
            let contents = JSON.parse(router.query.post as string);

            setSubmit("업데이트");
            setHtmlStr(contents.edit);
            // setHtmlStr(res.data.edit);
            setOldFile(contents.coverImage);
            setPostData(contents._id);
            setPreview([{ file: contents.image, imagePreviewUrl: contents.coverImage }]);
            setSelect(`${contents.label}/${contents.subLabel}`);
            setTitle(contents.title);
            setTagData(contents.tag);
        }
    }, [router]);

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

    const [files, setFiles] = React.useState<String | null>(null);
    const [preview, setPreview] = React.useState<{file: File | null, imagePreviewUrl: ArrayBuffer | string | null}[]>([]);
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        if (e.target.files === null || e.target.files?.length === 0 || e.target.files === undefined) return;

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            setPreview([{ file: file, imagePreviewUrl: reader.result }]);
        }

        reader.readAsDataURL(file);

        // firebase로 이미지 등록하기
        const imageRef = ref(storageRef, "cover");
        const spaceRef = ref(imageRef, _uuid + "-" + file.name);

        await uploadBytes(spaceRef, file)
        .then(async snap => {
            await getDownloadURL(ref(storage, snap.metadata.fullPath))
            .then(_url => {
                setFiles(_url)
                setOldFile(null);
            })
        })
    }
    const previewDeleted = () => {
        setPreview([{ file: null, imagePreviewUrl: null }]);
        setPreview([]);
        setFiles(null)
    }

    const onClick = async () => {
        // const formData = new FormData();

        if (userData.user === null) {
            alert("로그인 해주세요.");
            return router.push("/login");
        } else if (select === "선택해주세요." || select === "" || title === "" || tagData.length === 0 || htmlStr === "" || (files === null && oldFile === null)) return alert("뭔가 하나 빠졌습니다 !!!");
        // formData.append("select", select);
        // formData.append("title", title);
        // for (let i = 0; i < tagData.length; i++) formData.append("tagData", tagData[i]);
        // formData.append("edit", htmlStr);
        // formData.append("owner", userData.user._id);
        // if (files) formData.append("coverImage", files);

        let route;
        let formData;
        if (postData) {
            route = "/edit/update"
            // formData.append("_id", postData);
            formData = {
                _id: postData
            }
            // if (oldFile) formData.append("oldImage", oldFile);
        } else {
            route = "/edit/create"
        }

        if (oldFile) formData = { ...formData, coverImage: oldFile }
        else formData = { ...formData, coverImage: files }
        formData = {
            ...formData,
            select: select,
            title: title,
            edit: htmlStr,
            tagData: tagData,
            owner: userData.user._id,
        }
        console.log(formData);

        await api.post(route, formData)
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
                    <option value={select}>{select}</option>
                    {
                        categoriesData.category.length > 0 && categoriesData.category.map((item: CategoryProps) => (
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
                <div style={{display: "flex", flexWrap: "wrap", alignItems: "center", border: "1px solid #DDD", padding: "1rem", marginBottom: "2rem", marginTop: "2rem"}}>
                    <div style={{display: "flex"}}>
                        <div style={{whiteSpace: "nowrap", paddingRight: "1rem"}}>이미지를 선택해주세요.</div>
                        <div style={{position: "relative", width: "150px", height: "150px"}}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", position: "absolute", zIndex: "1", width: "100%", height: "100%", border: "1px solid #DDD", borderRadius: "8px"}}>이미지 선택</div>
                            <input style={{position: "absolute", width: "100%", height: "100%", opacity: "0", zIndex: "3"}} type="file" name="image" accept="image/*" onChange={onFileChange} />
                            {
                                preview.length > 0 && <span onClick={previewDeleted} style={{position: "absolute", right: ".5rem", top: ".5rem", cursor: "pointer", width: "24px", height: "24px", zIndex: "4"}}>
                                    <FontAwesomeIcon icon={faDeleteLeft} style={{width: "100%", height: "100%"}} />
                                </span>
                            }
                            {
                                preview.length > 0 && <div style={{position: "absolute", zIndex: "1"}}>
                                    {/* <Image unoptimized src={String(preview[0].imagePreviewUrl)} alt="대표 이미지" /> */}
                                    {/* <Image src={String(preview[0].imagePreviewUrl)} style={{width: "150px", height: "150px"}} alt="대표 이미지" /> */}
                                    <Image src={String(preview[0].imagePreviewUrl)} width={150} height={150} style={{borderRadius: "8px"}} alt="대표 이미지" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {/* 제출하기 */}
                <button style={{ float: "right", fontSize: "1rem", fontWeight: "bold", marginTop: "1rem", cursor: "pointer" }} onClick={onClick}>
                    등록하기
                </button>
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
  
    let userData = { success: false, user: {} };
    let categoriesData = { success: false, category: [] }
  
    await api.post("/edit/categoryFind")
    .then(res => {
      if (res.data.code === "y") categoriesData = { success: true, category: res.data.data }
    })
    .catch(err => console.log("Category Load Err", err));
  
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
      props: { userData, categoriesData }
    }
}