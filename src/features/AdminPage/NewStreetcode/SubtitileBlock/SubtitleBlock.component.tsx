import React, { ChangeEvent } from 'react';

import { Input } from 'antd';

interface Props {
    subTitle: string;
    setSubTitle: React.Dispatch<React.SetStateAction<string>>;
}
const SubtitleBlock = ({ subTitle, setSubTitle }: Props) => {
    return (
        <div className="adminContainer-block">
            <h2>Subtitle</h2>
            <Input maxLength={500} value={subTitle} showCount onChange={(e) => setSubTitle(e.target.value)} />
        </div>);
};

export default SubtitleBlock;
