import ReactQuill from 'react-quill';

const setQuillContents = (currentQuill: ReactQuill | null, text: string) => {
    if (currentQuill && currentQuill.editor) {
        const delta = currentQuill.editor.clipboard.convert(text);
        currentQuill.editor.setContents(delta);
    }
};

export default setQuillContents;
