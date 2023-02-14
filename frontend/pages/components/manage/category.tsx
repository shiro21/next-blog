import { api } from '@/pages/services/api';
import { CategoryProps, SubCategoryProps } from '@/pages/services/interface';
import styles from '@/styles/manage.module.scss'
import React, { ChangeEvent, useEffect, useState } from 'react';

const CategoryManage = () => {

    const [categoryWrap, setCategoryWrap] = useState([]);
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
    
    return (
        <>
            <div className={styles.category_wrap}>
                <h2>카테고리 관리</h2>
                <div className={styles.category_contents}>
                    <ul>
                        <li>전체보기
                            <span>
                                {/* 큰 카테고리 추가하기 */}
                                <button>추가</button>
                                {/* 카테고리 이름 수정하기 */}
                                <button>수정</button>
                            </span>
                        </li>
                        {/* Main */}
                        {
                            categoryWrap.length > 0 && categoryWrap.map((item: CategoryProps, index) => (
                                <React.Fragment key={index}>
                                    <li>
                                        {item.name}
                                        <span>
                                            {/* 작은 카테고리 추가하기 */}
                                            <button onClick={() => setSubStr(item.name)}>추가</button>
                                            {/* 카테고리 이름 수정하기 */}
                                            <button>수정</button>
                                            {/* 카테고리 삭제하기 ( 데이터가 있을때는 불가능 ) */}
                                            <button>삭제</button>
                                        </span>
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
                                                    {sub.name}
                                                    <span>
                                                        {/* 카테고리 이름 수정하기 */}
                                                        <button>수정</button>
                                                        {/* 카테고리 삭제하기 ( 데이터가 있을때는 불가능 ) */}
                                                        <button>삭제</button>
                                                    </span>
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