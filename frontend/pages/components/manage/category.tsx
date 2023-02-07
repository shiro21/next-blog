import styles from '@/styles/manage.module.scss'
import { useState } from 'react';

const CategoryManage = () => {

    const [category, setCategory] = useState();
    
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
                        <li>HTML
                            <span>
                                {/* 작은 카테고리 추가하기 */}
                                <button>추가</button>
                                {/* 카테고리 이름 수정하기 */}
                                <button>수정</button>
                                {/* 카테고리 삭제하기 ( 데이터가 있을때는 불가능 ) */}
                                <button>삭제</button>
                            </span>
                        </li>
                        <li>Javascript
                            <span>
                                <button>추가</button>
                                <button>수정</button>
                                <button>삭제</button>
                            </span>
                        </li>
                        <ul>
                            <li>Javascript 자식
                                <span>
                                    <button>추가</button>
                                    <button>수정</button>
                                    <button>삭제</button>
                                </span>
                            </li>
                            <li>Javascript 자식
                                <span>
                                    <button>추가</button>
                                    <button>수정</button>
                                    <button>삭제</button>
                                </span>
                            </li>
                            <li>Javascript 자식
                                <span>
                                    <button>추가</button>
                                    <button>수정</button>
                                    <button>삭제</button>
                                </span>
                            </li>
                        </ul>
                    </ul> 
                </div>
            </div>
        </>
    );
}

export default CategoryManage;