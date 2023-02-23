import './TagsListModal.styles.scss';

import { useState } from 'react';
import useMobx from '@stores/root-store';

import { Button } from 'antd';

import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';

interface Props {
    streetCodeid: number;
}

const TagListModal = ({ streetCodeid }: Props) => {
    const { tagsStore } = useMobx();
    const { fetchTagByStreetcodeId, getTagArray } = tagsStore;

    useAsync(() => {
        fetchTagByStreetcodeId(streetCodeid);
    });

    return (
        <div className="tagModalContainer">
            {getTagArray?.map((tag, idx) => (
                <Button
                    className="tagModalItem"
                    onClick={(e) => {
                        console.log(idx);
                    }}
                    key={idx}
                >
                    {tag.title}
                </Button>
            ))}
        </div>
    );
};

export default TagListModal;
