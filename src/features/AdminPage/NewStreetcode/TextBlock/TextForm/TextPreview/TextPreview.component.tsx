import { useState } from 'react';

import { Button } from 'antd';

import ReadMore from '@/features/StreetcodePage/TextBlock/ReadMore/ReadMore.component';

import TextInputInfo from '../TextInputInfo';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
}

const TextPreview = ({ inputInfo } : Props) => {
    const [disabled, setDisabled] = useState(true);

    return (
        <div>
            <Button
                disabled={inputInfo === undefined}
                onClick={() => setDisabled(!disabled)}
            >
                Попередній перегляд тексту
            </Button>
            { inputInfo !== undefined && !disabled ? (
                <div className="textComponent">
                    <div className="TextContainer">
                        <ReadMore text={String(inputInfo?.text)} />
                    </div>
                </div>
            ) : (
                <div style={{ width: '0' }} />
            ) }
        </div>
    );
};

export default TextPreview;
