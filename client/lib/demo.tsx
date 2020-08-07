import * as React from 'react';
const { useState } = React;
import Highlight, { defaultProps } from 'prism-react-renderer';

interface Props {
    code: string;
}

const Demo: React.FunctionComponent<Props> = (props) => {
    const [codeVisible, setCodeVisible] = useState(false);
    const code = (
        <Highlight {...defaultProps} code={props.code} language="jsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={className} style={style}>
                    {tokens.map((line, i) => (
                        <div key={i}>
                            {line.map((token, key) => (
                                <span {...getTokenProps({ token, key })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
    return (
        <div>
            <div>
                {props.children}
            </div>
            <div className="example">
                <button onClick={() => setCodeVisible(!codeVisible)}>查看代码</button>
                {codeVisible && code}
            </div>
        </div>
    )
}

export default Demo;