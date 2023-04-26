import React, { ChangeEvent } from 'react';

import { Input } from 'antd';

interface Props {
    setSubTitle: React.Dispatch<React.SetStateAction<string>>;
}
const SubtitleBlock = ({ setSubTitle }: Props) => (
    <div className="adminContainer-block">
        <h2>Subtitle</h2>
        <Input maxLength={500} showCount onChange={(e) => setSubTitle(e.target.value)} />
    </div>
);

export default SubtitleBlock;
