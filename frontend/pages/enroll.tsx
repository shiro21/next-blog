import * as React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components'
import { NextPage } from 'next';
const Editor = dynamic(() => import('@/pages/components/editor/wysiwygEditor'), { ssr: false }); // client 사이드에서만 동작되기 때문에 ssr false로 설정

const Enroll: NextPage = () => {
    // state
    const [htmlStr, setHtmlStr] = React.useState<string>('');

    // ref
    const viewContainerRef = React.useRef<HTMLDivElement>(null);

    // useEffect
    React.useEffect(() => {
        if(viewContainerRef.current) {
            viewContainerRef.current.innerHTML = '<h2>html 코드를 이용하여 만들어지는 View입니다.</h2>'
            viewContainerRef.current.innerHTML += htmlStr;
        }
    }, [htmlStr])

    return (
        <>
            <EditorContainer>
                <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
            </EditorContainer>

            <Contents.Container>
                <Contents.HtmlContainer>
                    <h2>Editor를 통해 만들어진 html 코드입니다.</h2>
                    {htmlStr}
                </Contents.HtmlContainer>

                <Contents.ViewContainer ref={viewContainerRef} />
            </Contents.Container>
        </>
    );
};

export default Enroll;

// style
const EditorContainer = styled.div`
    width: 800px;
    height: 400px;

    margin: 0 auto;

    // Editor 스타일 설정
    .wrapper { }

    .editor {
        height: 300px;
    }

    .toolbar { }
`;

const Contents = {
    Container: styled.div`
        width: 1200px;
        
        margin: 0 auto;

        display: flex;
        gap: 40px;

        & > div {
            width: 600px;

            padding: 16px;

            box-sizing: border-box;

            line-break: anywhere;
        }
    `,

    HtmlContainer: styled.div`
        border: 2px solid orange;
    `,

    ViewContainer: styled.div`
        border: 2px solid olive;
    `,
}