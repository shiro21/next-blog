import LoginForm from "./components/login/loginForm";
import Seo from "./components/Seo";

const Login = () => {
    return (
        <article style={{ backgroundColor: "#E5F6FF", width: "100vw", height: "100vh" }}>
            <Seo title="로그인" />

            <LoginForm />
        </article>
    );
};

export default Login;