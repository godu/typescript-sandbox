import { createRoot } from 'react-dom/client';
import React, { useCallback, useEffect, useState, DragEvent } from 'react'
import Tesseract from 'tesseract.js';

import dataUri from './eng_bw.png';

const recognize = async (dataUri: string) => {
    const { data: { text } } = await Tesseract.recognize(
        dataUri,
        'eng',
        {
            logger: m => console.log(m)
        }
    );

    return text;
}

const preventDefault = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
}

const App = (): React.ReactElement => {

    const [imageUri, setimageUri] = useState<string>(dataUri);
    const [text, setText] = useState('');

    const onDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const uri = URL.createObjectURL(file);
        setimageUri(uri);
    }, [setText]);

    useEffect(() => {
        recognize(imageUri).then(setText);
    }, [imageUri])

    return <div
        style={{
            height: '100%',
            width: '100%'
        }}
        draggable={true}
        onDragEnter={preventDefault}
        onDragOver={preventDefault}
        onDrop={onDrop}
    >
        <div style={{
            display: 'flex',
        }} >
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
                    value={text}
                    readOnly
                    style={{
                        width: '100%'
                    }}
                />
            </div>
        </div>
    </div>;
}

const container = document.getElementById('app');
if (!container) throw new TypeError('Container is not found');
const root = createRoot(container)
root.render(<App />);
