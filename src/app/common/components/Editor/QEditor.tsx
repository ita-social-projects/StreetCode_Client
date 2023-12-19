import './QEditor.styles.scss';

import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';

import 'react-quill/dist/quill.snow.css';

import LinkHandler from './EditorExtensions/LinkHandler';

interface EditorProps {
    qRef: any,
    value: string;
    onChange: (html: string) => void;
    maxChars: number,
    initialVal?: string,
}

const Editor: React.FC<EditorProps> = ({
    qRef, value, onChange, maxChars, initialVal,
}) => {
    const [val, setVal] = useState(value);
    const removeHtmlTags = (content: string) => content.replace(/<[^>]*>/g, '');
    const [rawText, setRawText] = useState(removeHtmlTags(value) ?? '');
    const [characterCount, setCharacterCount] = useState(rawText.length ?? 0);
    const quillRef = useRef<ReactQuill | null>(null);
    const availableButtons = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Home', 'End']);

    const countCharacters = (content: string) => {
        const textWithoutTags = removeHtmlTags(content);
        const count = textWithoutTags.length;
        setCharacterCount(count);
    };

    useEffect(() => {
        setRawText(removeHtmlTags(value));
    }, [value]);

    const handleOnChange = (html: string) => {
        onChange(html);
        setVal(html);
        countCharacters(html);
    };

    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, 6] }],
                ['bold', 'italic', 'strike', 'underline', 'link'],
                [
                    { list: 'ordered' },
                    { list: 'bullet' },
                ],
                ['clean'],
            ],
            link: LinkHandler,
        },
    };

    const formats = [
        'header', 'size', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent', 'align', 'link', 'clean',
    ];

    return (
        <>
            <div className="quillEditor">
                <ReactQuill
                    defaultValue={initialVal}
                    value={val || ''}
                    onChange={handleOnChange}
                    modules={modules}
                    onKeyDown={(e) => {
                        if (characterCount >= maxChars && !availableButtons.has(e.key)
                            && quillRef.current?.editor?.getSelection()?.length === 0) {
                            e.preventDefault();
                        }
                    }}
                    ref={(el) => {
                        quillRef.current = el;
                        if (qRef) {
                            qRef.current = el;
                        }
                    }}
                    style={{ height: 300 }}
                    formats={formats}
                    theme="snow"
                    // onChangeSelection={ } // still can paste logner text if current text < chars limit
                />
            </div>
            <div className="charsCounter">
                Лічильник символів:
                {' '}
                {characterCount}
                /
                {maxChars}
            </div>
        </>
    );
};

export default Editor;
