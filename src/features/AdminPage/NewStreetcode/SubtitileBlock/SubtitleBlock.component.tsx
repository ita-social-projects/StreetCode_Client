import React from 'react';

import { Input } from 'antd';

import Subtitle from '@/models/additional-content/subtitles.model';

interface Props {
    subTitle: Partial<Subtitle> | undefined;
    setSubTitle: React.Dispatch<React.SetStateAction<Partial<Subtitle | undefined>>>;
}
const SubtitleBlock = React.memo(({ subTitle, setSubTitle }: Props) => (
    <div className="adminContainer-block">
        <h2>Бігуча стрічка</h2>
        <Input
            maxLength={500}
            value={subTitle?.subtitleText}
            showCount
            onChange={(e) => setSubTitle({
                ...subTitle,
                subtitleText: e.target.value,
            })}
        />
    </div>
));

export default SubtitleBlock;
