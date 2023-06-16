import './DragableTags.styles.scss';

import React from 'react';
import {
    DragDropContext, Draggable, DraggableProvided, DraggableStateSnapshot, DropResult,
} from 'react-beautiful-dnd';

// eslint-disable-next-line import/extensions
import StrictModeDroppable from '@/app/common/components/StrictModeDroppable';
import { StreetcodeTag } from '@/models/additional-content/tag.model';

import ClickableTagItem from './ClickableTagItem';

function reorder<T>(list:Array<T>, startIndex:number, endIndex:number):Array<T> {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

interface Props {
    tags: StreetcodeTag[],
    setTags:React.Dispatch<React.SetStateAction<StreetcodeTag[]>>
}

const DragableTags = React.memo(({ tags, setTags }: Props) => {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = reorder(
            tags,
            result.source.index,
            result.destination.index,
        );
        console.log(items);
        setTags(items);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
        ...draggableStyle,
        background: isDragging ? '#8D1F16' : 'white',
        color: isDragging ? 'white' : 'black',
        display: 'flex',
        flexDirection: 'row',
    });
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="droppable" direction="horizontal">
                {(prov) => (
                    <div {...prov.droppableProps} ref={prov.innerRef} className="draggable-tag-list">
                        {tags.map((tag, index) => (
                            <Draggable
                                key={tag.id}
                                draggableId={`d${tag.id}`}
                                index={index}
                                disableInteractiveElementBlocking
                            >
                                {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                                    <div
                                        className="draggable-tag"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                    >
                                        <ClickableTagItem
                                            tag={tag}
                                            setVisibility={(visibility) => {
                                                // eslint-disable-next-line no-param-reassign
                                                tags[index].isVisible = visibility;
                                            }}
                                        />
                                    </div>
                                )}

                            </Draggable>
                        ))}
                        {prov.placeholder}
                    </div>
                )}
            </StrictModeDroppable>
        </DragDropContext>
    );
});
export default DragableTags;
