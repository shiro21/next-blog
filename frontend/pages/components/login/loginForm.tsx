import styles from '@/styles/_login.module.scss'
import Image from 'next/image';
import favi from '@/public/favi.ico'
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { ChangeEvent, useState } from 'react';
import { LoginProps } from '@/pages/services/interface';
import { api } from '@/pages/services/api';
import { useRouter } from 'next/router';
import { setTokenCookie } from './tokenCookies';

const LoginForm = () => {

    const router = useRouter();

    const [formData, setFormData] = useState<LoginProps>({
        id: "",
        password: ""
    });
    const [autoSave, setAutoSave] = useState<boolean>(false);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.id === "" || formData.password === "") return alert("아이디와 비밀번호를 입력해주세요.");
        api.post("/user/login", formData)
        .then(res => {
            if (res.data.code === "id") {

                setFormData({id: "", password: ""});
                return alert(res.data.message);

            } else if (res.data.code === "password") {
                
                setFormData({id: "", password: ""});
                return alert(res.data.message);

            } else if (res.data.code === "y") {

                setTokenCookie(res.data.token);
                
                if (autoSave) {
                    // localStorage.setItem("@nextjs-blog-token", res.data.token);
                    // localStorage.setItem("@nextjs-blog-user", res.data.user);

                    // sessionStorage.removeItem("@nextjs-blog-token");
                    // sessionStorage.removeItem("@nextjs-blog-user");
                } else {
                    // sessionStorage.setItem("@nextjs-blog-token", res.data.token);
                    // sessionStorage.setItem("@nextjs-blog-user", res.data.user);

                    // localStorage.removeItem("@nextjs-blog-token");
                    // localStorage.removeItem("@nextjs-blog-user");
                }

                router.push("/");
            }
        })
        .catch(err => console.log("Login Err", err));
    }

    return (
        <section className={styles.login_section_wrap}>
            <div className={styles.login_bg_wrap} style={{ backgroundImage: "url('/blue.avif')"}}>
                <div className={styles.bg_contents_wrap}>
                    
                    <div>
                        <FontAwesomeIcon width={40} height={40} fontSize={40} color="white" icon={faCaretRight} />
                        Shiro21의 블로그에
                    </div>
                    <span> 오신것을 환영합니다.</span>
                    <p>Always do your best.</p>
                </div>
            </div>

            <form className={styles.login_form_wrap} onSubmit={onSubmit}>
                <Image className={styles.login_logo} src={favi} width={60} height={60} alt="로고" />
                <h3>어서오세요.</h3>
                <p>방문을 진심으로 감사드립니다.<br />가입은 오랜만에 연습용으로 만들어 두었습니다.</p>

                <div className={styles.input_wrap}>
                    <label htmlFor="id">아이디를 입력해주세요.</label>
                    <input type="text" id="id" name="id" value={formData.id} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, id: e.target.value.replace(/[^\\!-z]/gi,"")})} />
                </div>

                <div className={styles.input_wrap}>
                    <label htmlFor="password">비밀번호를 입력해주세요.</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value})} />
                </div>

                <div className={styles.find_wrap}>
                    <div>
                        <input type="checkbox" id="save" name="save" checked={autoSave} onChange={() => setAutoSave(prev => !prev)} />
                        <label htmlFor="save">자동 로그인</label>
                    </div>
                    <div>
                        <Link href="/">비밀번호 찾으러가기</Link>
                    </div>
                </div>

                <div className={styles.input_wrap}>
                    <button type="submit">로그인</button>
                </div>
            </form>
        </section>
    );
};

export default LoginForm;