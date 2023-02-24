import './TagList.styles.scss';

import useMobx from '@stores/root-store';

import { Button } from 'antd';

import Tag from '@/models/additional-content/tag.model';

interface Props {
    tags: Tag[] | undefined;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>
}

const TagList = ({ tags, setActiveTagId }: Props) => {
    const { modalStore } = useMobx();
    const { setModal } = modalStore;
    return (
        <div className="tagContainer">
            {tags?.map((tag) => (
                <Button
                    className="tagItem"
                    onClick={() => {
                        setActiveTagId(tag.id);
                        setModal('tagsList');
                    }}
                    key={tag.id}
                >
                    {tag.title}
                </Button>
            ))}
        </div>
    );
};

export default TagList;
