import { useState } from 'react';

import { Button } from 'antd';

import TextInputInfo from '@/features/AdminPage/NewStreetcode/TextBlock/InputType/TextInputInfo.model';
import ReadMore from '@/features/StreetcodePage/TextBlock/ReadMore/ReadMore.component';

interface Props {
    inputInfo: Partial<TextInputInfo> | undefined;
}

const TextPreview = ({ inputInfo } : Props) => {
    const [disabled, setDisabled] = useState(true);

    return (
        <div>
            <Button
                disabled={inputInfo === undefined || inputInfo.text?.length === 0}
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
