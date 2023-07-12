import React from 'react';

import { Input } from 'antd';

import Subtitle from '@/models/additional-content/subtitles.model';

interface Props {
    subTitle: Partial<Subtitle> | undefined;
    setSubTitle: React.Dispatch<React.SetStateAction<Partial<Subtitle | undefined>>>;
    onChange: (field: string, value: any) => void;
}
const SubtitleBlock = React.memo(({ subTitle, setSubTitle, onChange }: Props) => (
    <div className="adminContainer-block">
        <h2>Бігуча стрічка</h2>
        <Input
            maxLength={500}
            value={subTitle?.subtitleText}
            showCount
            onChange={(e) => {
                const updatedSubTitle = {
                    ...subTitle,
                    subtitleText: e.target.value,
                };
                setSubTitle(updatedSubTitle);
                onChange('subTitle', updatedSubTitle);
            }}
        />
    </div>
));

export default SubtitleBlock;
