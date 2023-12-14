import './TagList.styles.scss';

import useMobx, { useModalContext } from '@stores/root-store';

import { Button } from 'antd';

import Tag from '@/models/additional-content/tag.model';
import useWindowSize from '../../hooks/stateful/useWindowSize.hook';

interface Props {
    tags: Tag[] | undefined;
    setActiveTagId: React.Dispatch<React.SetStateAction<number>>,
    setActiveTagBlock: React.Dispatch<React.SetStateAction<number>>
}

const TagList = ({ tags, setActiveTagId, setActiveTagBlock }: Props) => {
    const { modalStore } = useModalContext();
    const { setModal } = modalStore;
    const windowSize = useWindowSize();
    return (
        <div className="tagContainer">
            {tags?.map((tag, index) => (
                <Button
                    className="tagItem"
                    onClick={() => {
                        {
                            if(windowSize.width > 1024){
                                setActiveTagId(tag.id);
                                setModal('tagsList');
                                setActiveTagBlock(index);
                            }
                        }
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
