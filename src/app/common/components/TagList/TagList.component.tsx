import './TagList.styles.scss';

import useMobx from '@stores/root-store';

import { Button } from 'antd';

interface Props {
    tags: string[] | undefined;
}

const TagList = ({ tags }: Props) => {
    const { modalStore } = useMobx();
    const { setModal, modalsState: { tagsList } } = modalStore;
    return (
        <div className="tagContainer">
            {tags?.map((tag, idx) => (
                <Button
                    className="tagItem"
                    onClick={() => {
                        if (!tagsList.isOpen) {
                            setModal('tagsList');
                        }
                    }}
                    key={idx}
                >
                    {tag}
                </Button>
            ))}
        </div>
    );
};

export default TagList;
