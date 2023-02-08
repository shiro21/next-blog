import * as React from 'react';
import dynamic from 'next/dynamic';
import { NextPage } from 'next';

const Editor = dynamic(() => import("@/pages/components/editor/editor"), { ssr: false }); // client 사이드에서만 동작되기 때문에 ssr false로 설정

const Write: NextPage = () => {
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
            <div>
                <Editor htmlStr={htmlStr} setHtmlStr={setHtmlStr} />
            </div>

            <div>
                <div>
                    <h2>Editor를 통해 만들어진 html 코드입니다.</h2>
                    <div dangerouslySetInnerHTML={{__html: htmlStr}} />
                </div>

                <div ref={viewContainerRef} />
            </div>
        </>
    );
};

export default Write;