import styles from '@/styles/_login.module.scss'
import Image from 'next/image';
import favi from '@/public/favi.ico'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import React, { ChangeEvent, useState } from 'react';
import { RegisterProps } from '../services/interface';
import { api } from '../services/api';
import { useRouter } from 'next/router';

const Register = () => {

    const router = useRouter();

    const [formData, setFormData] = useState<RegisterProps>({
        _id: "",
        id: "",
        email: "",
        password: "",
        passwordConfirm: "",
        type: "local",
        role: "owner",
        roleLabel: "관리자",
        name: "",
        profile: "/profile.jpg",
        createdAt: "",
        updatedAt: ""
    });
    const [mailCheck, setMailCheck] = useState<string>("");
    const [mailConfirmCheck, setMailConfirmCheck] = useState<string>("");

    const emailConfirm = async () => {

        if (formData.email.length <= 3) return alert("이메일을 입력해주세요.");

        await api.post("/user/emailConfirm", { email: formData.email })
        .then(res => {
            if (res.data.code === "email") return alert(res.data.message);
            else if (res.data.code === "y") setMailCheck(String(res.data.data));
        })
        .catch(err => console.log("Email Err", err));
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const pattern1 = /[0-9]/;

        const pattern2 = /[a-zA-Z]/;

        const pattern3 = /[~!@\#$%<>^&*]/;

        if (mailCheck === "") return alert("메일번호를 체크해주세요.");
        else if (mailCheck !== mailConfirmCheck) return alert("메일 확인 번호가 다릅니다.");
        else if (formData.id === "" || formData.id.length <= 4 || formData.id.length >= 16) return alert("아이디를 5자이상 16자 미만 입력해주세요.");
        else if (!pattern1.test(formData.password) || !pattern2.test(formData.password) || !pattern3.test(formData.password) || formData.password.length < 8 || formData.password.length > 50) return alert("영문 + 숫자 + 특수기호 8자리 이상 50자 미만으로 입력해주세요.");
        else if (formData.password !== formData.passwordConfirm) return alert("비밀번호 확인이 다릅니다.");
        else if (formData.name.length <= 2) return alert("닉네임을 3글자 이상 입력해주세요.");

        api.post("/user/create", formData)
        .then(res => {
            if (res.data.code === "id") return alert(res.data.message);
            else if (res.data.code === "y") {
                sessionStorage.setItem("@nextjs-blog-token", res.data.token);
                sessionStorage.setItem("@nextjs-blog-user", res.data.user);
                router.push("/");
            }
        })
        .catch(err => console.log("Register Err", err));
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
                    <input type="text" id="id" name="id" value={formData.id} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, id: e.target.value.replace(/[^\\!-z]/gi,"")})} />
                </div>

                <div className={styles.input_wrap}>
                    <label htmlFor="password">비밀번호를 입력해주세요.</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value})} />
                </div>

                <div className={styles.input_wrap}>
                    <label htmlFor="passwordConfirm">비밀번호를 확인해주세요.</label>
                    <input type="password" id="passwordConfirm" name="passwordConfirm" value={formData.passwordConfirm} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, passwordConfirm: e.target.value})} />
                </div>

                <div className={styles.input_wrap} style={{position: "relative"}}>
                    <label htmlFor="email">이메일을 입력해주세요.</label>
                    <input style={{marginBottom: "10px", marginRight: "100px", paddingRight: "100px"}} type="email" id="email" name="email" value={formData.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value})} />
                    <button style={{position: "absolute", top: "34px", right: "0", width: "80px", zIndex: "1", borderRadius: "0 8px 8px 0" }} type="button" onClick={emailConfirm}>확인</button>
                    <input type="text" value={mailConfirmCheck} onChange={(e: ChangeEvent<HTMLInputElement>) => setMailConfirmCheck(String(e.target.value))} />
                </div>

                <div className={styles.input_wrap}>
                    <label htmlFor="nick">닉네임을 입력해주세요.</label>
                    <input type="text" id="nick" name="nick" value={formData.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value})} />
                </div>

                <div className={styles.input_wrap}>
                    <button type="submit">회원가입</button>
                </div>
            </form>
        </section>
    );
}

export default Register;