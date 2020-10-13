import ReactDOM from 'react-dom'
import React, { useCallback, useState } from 'react'
import Tesseract from 'tesseract.js';

import dataUri from './eng_bw.png';

// Tesseract.recognize(
//     dataUri,
//     'eng',
//     { logger: m => console.log(m) }
// ).then(({ data: { text } }) => {
//     console.log(text);
// })


const App = (): React.ReactElement => {

    const [imageUri, setimageUri] = useState(dataUri);
    const [text, setText] = useState('');

    const recognize = useCallback((e) => {
        e.stopPropagation();
        e.preventDefault();

        console.log(e)
        // Tesseract.recognize(
        //     dataUri,
        //     'eng',
        //     { logger: m => console.log(m) }
        // ).then(({ data: { text } }) => {
        //     console.log(text);
        // })
    }, [setText]);

    return <div
        style={{
            display: 'flex'
        }}
        onDrop={recognize}
    >
        <div
            style={{
                display: 'flex',
                flex: 1
            }}
        >
            <img
                src={imageUri}
                style={{
                    width: '100%'
                }}
            />
        </div>
        <div
            style={{
                display: 'flex',
                flex: 1
            }}
        >
            <textarea
                onDrop={recognize}
                value={text}
                readOnly
                style={{
                    width: '100%'
                }}
            />
        </div>
    </div>;
}



const el = document.getElementById('app');
if (el) ReactDOM.render(<App />, el);
