import { api } from '@/services/api';
import { CategoryProps, CategoryTestProps, SubCategoryProps } from '@/services/interface';
import styles from '@/styles/manage.module.scss'
import React, { ChangeEvent, useEffect, useState } from 'react';

const CategoryManage = () => {

    const [categoryWrap, setCategoryWrap] = useState<CategoryProps[]>([]);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [listOpen, setListOpen] = useState(false);

    useEffect(() => {

        api.post("/edit/categoryFind")
        .then(res => {
            if (res.data.code === "y") setCategoryWrap(res.data.data);
        })
        .catch(err => console.log("Edit Find Err", err));
    }, [])

    const categoryAdd = () => {

        if (category === "" || category.length <= 1) return alert("카테고리를 입력해주세요.");

        const categoryData = {
            _id: "",
            createdAth: "",
            updatedAth: "",
            isDeleted: false,
            name: category,
            label: category,
            priority: categoryWrap.length,
            entries: 0,
            depth: 1,
            parent: "",
            categoryInfo: {
                image: "",
                description: ""
            },
            opened: true,
            updateData: false,
            leaf: true,
            children: []
        }

        api.post("/edit/categoryCreate", categoryData)
        .then(res => {
            if (res.data.code === "y") {
                setCategoryWrap(res.data.data);
                setCategory("");
            }
            else alert("생성 실패");
        })
        .catch(err => console.log("Category Create Err", err));
    }

    const [subStr, setSubStr] = useState("");

    const subCategoryAdd = (_id: string, categoryName: string, len: number) => {

        const categoryData = {
            _id: "",
            createdAth: "",
            updatedAth: "",
            isDeleted: false,
            name: subCategory,
            label: `${categoryName}/${subCategory}`,
            priority: len,
            entries: 0,
            depth: 2,
            parent: _id,
            categoryInfo: {
                image: "",
                description: ""
            },
            opened: true,
            updateData: false,
            leaf: true
        }

        api.post("/edit/subCategoryCreate", categoryData)
        .then(res => {
            if (res.data.code === "y") {
                setCategoryWrap(res.data.data);
                setSubCategory("");
            }
            else alert("생성 실패");
        })
        .catch(err => console.log("SubCategory Create Err", err));
    }

    const [updateOpen, setUpdateOpen] = useState("");
    const [newName, setNewName] = useState("");
    const categoryUpdate = (_id: string) => {
        if (_id !== updateOpen) setUpdateOpen(_id);
        else setUpdateOpen("");
    }
    const nameUpdate = (list: string, item: CategoryProps | SubCategoryProps) => {

        if (newName === "") return alert("변경할 이름을 적어주세요.");
        api.post("/edit/categoryUpdate", {_id: item._id, name: newName, list: list})
        .then(async res => {
            if (res.data.code === "y") {
                console.log(categoryWrap)
                const findIndex = categoryWrap.findIndex((ele: CategoryProps) => ele._id === item._id);
                const subFindIndex = categoryWrap.findIndex((parents: CategoryProps) => parents._id === res.data.data.parent);
                let childrenIndex: number | null = null;
                let newCate: CategoryTestProps[] = categoryWrap;

                // categoryWrap.findIndex(chil => chil._id === item._id);
                for (let i = 0; i < newCate.length; i++) {                    
                    for (let j = 0; j < newCate[i].children.length; j++) {

                        if (newCate[i].children[j]._id === item._id) childrenIndex = j;
                    }
                }

                let copyCategoryArray: CategoryProps[] = [...categoryWrap];
                let copySubCategoryArray: CategoryTestProps[] = [...newCate];
                
                if (findIndex !== -1) copyCategoryArray[findIndex] = {...copyCategoryArray[findIndex], name: res.data.data.name, label: res.data.data.label}
                if (subFindIndex !== -1 && childrenIndex !== null) copySubCategoryArray[subFindIndex].children[childrenIndex] = {...copySubCategoryArray[subFindIndex].children[childrenIndex], name: res.data.data.name, label: res.data.data.label }

                setCategoryWrap(copyCategoryArray);
                setNewName("");
                setUpdateOpen("");
            }
        })
        .catch(err => console.log("Category Update Err", err));
    }

    const onDeleted = (item: CategoryProps | SubCategoryProps) => {
        let result = confirm("정말 카테고리를 삭제하시겠습니까?");

        if (result) {
            api.post("/edit/categoryDelete", item)
            .then(res => {
                if (res.data.code === "n") return alert(res.data.message);
                else if (res.data.code === "y") setCategoryWrap(res.data.data);
            })
            .catch(err => console.log("Category Deleted Err", err));
        }
    }
    
    return (
        <>
            <div className={styles.category_wrap}>
                <h2>카테고리 관리</h2>
                <div className={styles.category_contents}>
                    <ul>
                        <li>전체보기</li>
                        {/* Main */}
                        {
                            categoryWrap.length > 0 && categoryWrap.map((item: CategoryProps, index) => (
                                <React.Fragment key={index}>
                                    <li>
                                        {
                                            updateOpen === item._id ? (
                                                <>
                                                    <span><input type="text" value={newName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)} /></span>
                                                    <span className={styles.category_update}>
                                                        {/* 카테고리 이름 수정하기 */}
                                                        <button onClick={() => nameUpdate("main", item)}>수정</button>
                                                        {/* 카테고리 수정 취소하기 */}
                                                        <button onClick={() => setUpdateOpen("")}>취소</button>
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{item.name}</span>
                                                    <span className={styles.category_update}>
                                                        {/* 작은 카테고리 추가하기 */}
                                                        <button onClick={() => setSubStr(item.name)}>추가</button>
                                                        {/* 카테고리 이름 수정하기 */}
                                                        <button onClick={() => categoryUpdate(item._id)}>수정</button>
                                                        {/* 카테고리 삭제하기 ( 데이터가 있을때는 불가능 ) */}
                                                        <button onClick={() => onDeleted(item)}>삭제</button>
                                                    </span>
                                                </>
                                            )
                                        }
                                    </li>
                                    {/* Sub */}
                                    <ul>
                                        {
                                            subStr === item.name && <li>
                                                <input type="text" value={subCategory} onChange={(e: ChangeEvent<HTMLInputElement>) => setSubCategory(e.target.value)} />
                                                <div className={styles.create_button}>
                                                    <button onClick={() => subCategoryAdd(item._id, item.name, item.children.length)}>생성</button>
                                                    <button onClick={() => setSubStr("")}>취소</button>
                                                </div>
                                            </li>
                                        }
                                        {
                                            item.children.length > 0 && item.children.map((sub: SubCategoryProps, subIndex) => (
                                                <li key={subIndex}>
                                                    {
                                                        updateOpen === sub._id ? (
                                                            <>
                                                                <span><input type="text" value={newName} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewName(e.target.value)} /></span>
                                                                <span className={styles.category_update}>
                                                                    {/* 카테고리 이름 수정하기 */}
                                                                    <button onClick={() => nameUpdate("sub", sub)}>수정</button>
                                                                    {/* 카테고리 수정 취소하기 */}
                                                                    <button onClick={() => setUpdateOpen("")}>취소</button>
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>{sub.name}</span>
                                                                <span className={styles.category_update}>
                                                                    {/* 카테고리 이름 수정하기 */}
                                                                    <button onClick={() => categoryUpdate(sub._id)}>수정</button>
                                                                    {/* 카테고리 삭제하기 ( 데이터가 있을때는 불가능 ) */}
                                                                    <button onClick={() => onDeleted(sub)}>삭제</button>
                                                                </span>
                                                            </>
                                                        )
                                                    }
                                                    
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </React.Fragment>
                            ))
                        }
                    </ul> 
                    <ul>
                        {
                            listOpen && <li>
                                <input type="text" value={category} onChange={(e: ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} />
                                <div className={styles.create_button}>
                                    <button onClick={categoryAdd}>생성</button>
                                    <button onClick={() => setListOpen(prev => !prev)}>취소</button>
                                </div>
                            </li>
                        }
                        <li onClick={() => setListOpen(prev => !prev)}>카테고리 추가</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default CategoryManage;