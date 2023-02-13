import * as React from 'react';
import dynamic from 'next/dynamic';
import { NextPage } from 'next';

const Editor = dynamic(() => import("@/pages/components/editor/editor"), { ssr: false }); // client 사이드에서만 동작되기 때문에 ssr false로 설정

const Write: NextPage = () => {
    // state
    const [htmlStr, setHtmlStr] = React.useState<string>('');

    // ref
    // const viewContainerRef = React.useRef<HTMLDivElement>(null);

    // // useEffect
    // React.useEffect(() => {
    //     if(viewContainerRef.current) {
    //         viewContainerRef.current.innerHTML = '<h2>html 코드를 이용하여 만들어지는 View입니다.</h2>'
    //         viewContainerRef.current.innerHTML += htmlStr;
    //     }
    // }, [htmlStr])

    const onClick = () => {
        console.log(htmlStr);
    }

    return (
        <>
            <div style={{ width: "800px", margin: "0 auto", marginTop: "2rem" }}>
                <select style={{ marginBottom: "1rem", width: "150px", fontSize: "1rem", fontWeight: "bold", marginTop: "1rem" }}>
                    <option value={"비어있음"}>선택해주세요.</option>
                    {
                        // map 들어갈 자리
                    }
                </select>
                <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
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