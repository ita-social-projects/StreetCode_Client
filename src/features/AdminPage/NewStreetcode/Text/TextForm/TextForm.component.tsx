import './TextForm.styles.scss';

import { useState } from 'react';

const TextForm = () => {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');

    const maxTitleLenght = 50;

    const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    };

    return (
        <div className="text-form">
            <h3>Заголовок</h3>
            <input
                className="smaller-input"
                name="title"
                type="text"
                maxLength={maxTitleLenght}
                onChange={handleChangeTitle}
            />
            <p className="smaller-input">
                {title.length}
                /
                {maxTitleLenght}
            </p>
            <h3>Основний текст</h3>
            <textarea
                name="main-text"
                onChange={handleChangeText}
            />
            <p>
                {text.length}
            </p>
            <h3>Відео</h3>
            <input
                className="smaller-input"
                placeholder="https://www.youtube.com"
                pattern="https?://www.youtube.com/watch.+"
                name="link"
                onChange={handleLinkChange}
            />
        </div>
    );
};

export default TextForm;
