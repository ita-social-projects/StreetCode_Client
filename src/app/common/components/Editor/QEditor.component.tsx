/* eslint-disable react/jsx-one-expression-per-line */
import './QEditor.styles.scss';

import React, { useEffect, useRef, useState } from 'react';
import ReactQuill, { UnprivilegedEditor } from 'react-quill';
import { Sources } from 'quill';

import 'react-quill/dist/quill.snow.css';

import LinkHandler from './EditorExtensions/LinkHandler';

interface EditorProps {
    qRef: React.RefObject<ReactQuill>,
    value: string;
    onChange: (html: string) => void;
    maxChars: number,
    initialVal?: string,
    selectionChange?: (selection: string) => void;
}

const Editor: React.FC<EditorProps> = ({
    qRef, value, onChange, maxChars, initialVal, selectionChange,
}) => {
    const [val, setVal] = useState(value);
    const removeHtmlTags = (content: string) => content.replace(/<[^>]*>|&nbsp;/g, (match) => {
        if (match === '&nbsp;') return ' ';
        return '';
    });
    const [rawText, setRawText] = useState(removeHtmlTags(value) ?? '');
    const [characterCount, setCharacterCount] = useState(rawText.length ?? 0);
    const quillRef = useRef<ReactQuill | null>(null);
    const availableButtons = new Set(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
        'ArrowUp', 'ArrowDown', 'Home', 'End']);
    const [validateDescription, setValidateDescription] = useState<boolean>(false);

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

    const handleSelectionChange = (range: ReactQuill.Range | null, source: Sources, editor: UnprivilegedEditor) => {
        if (range && range.index != null && range.length != null) {
            const selectedText = editor.getText(range.index, range.length);
            if (selectionChange) {
                selectionChange(selectedText);
            }
        }
    };

    useEffect(() => {
        if (characterCount > maxChars) {
            setValidateDescription(true);
        } else {
            setValidateDescription(false);
        }
    }, [characterCount, maxChars]);

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
                        if (characterCount >= maxChars) {
                            setValidateDescription(true);
                            if (!availableButtons.has(e.key)
                                && quillRef.current?.editor?.getSelection()?.length === 0) {
                                e.preventDefault();
                            }
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
                    onChangeSelection={handleSelectionChange}
                />
            </div>
            <div className="editorInfoContainer">
                {validateDescription && (
                    <span className="validateLabelDescription">
                        Максимальна довжина - {maxChars}
                    </span>
                )}
                <div className="charsCounter">
                    Символи: {characterCount}/{maxChars}
                </div>
            </div>
        </>
    );
};

export default Editor;
