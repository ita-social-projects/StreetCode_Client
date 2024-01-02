import ReactQuill from 'react-quill';

export const setQuillContents = (currentQuill: ReactQuill | null, text: string) => {
    if (currentQuill && currentQuill.editor) {
        const delta = currentQuill.editor.clipboard.convert(text);
        currentQuill.editor.setContents(delta);
    }
};

export const checkQuillTextLength = (currentQuill: ReactQuill | null, maxChars: number) => {
    if (currentQuill && currentQuill.editor) {
        if (currentQuill.editor.getText().length > maxChars) {
            throw new Error();
        }
    }
};
