import { GetServerSideProps } from "next";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            {children}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // console.log(context.req);
    const isLogin = context.req ? context.req.cookies.token : "";
  
    console.log(isLogin);
    // cookies();
  
    return {
      props: {
        // isLogin
      }
    }
}

export default Layout;