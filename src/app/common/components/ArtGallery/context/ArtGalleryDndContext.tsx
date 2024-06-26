import React, { DragEventHandler, HTMLProps, ReactNode } from 'react';
import {
    DndContext, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import Art from '@models/media/art.model';
import useMobx from '@stores/root-store';
import type { DragEndEvent } from '@dnd-kit/core/dist/types/events';

type Props = {
    children: ReactNode;
} & HTMLProps<HTMLDivElement>;

const TodoDndContext: React.FC<Props> = ({ children, ...props }: Props) => {
    const { artStore, artGalleryTemplateStore, streetcodeArtSlideStore } = useMobx();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        }),
    );
    const { onDragEnd: _, onDragStart: a, onDragOver: b,  ...rest } = props;

    return (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        <DndContext onDragEnd={onDragEnd} sensors={sensors} {...rest}>
            {children}
        </DndContext>
    );

    function onDragEnd(event: DragEndEvent): void {
        const droppableComplexId = event?.over?.id.toString() || null;
        const draggbleId = parseInt(event.active.id as string, 10);

        if (!draggbleId || !droppableComplexId) return;

        const slideTemplateNumber = parseInt(droppableComplexId.split('-')[0], 10);
        const artIndex = parseInt(droppableComplexId.split('-')[1], 10);

        const art = artStore.arts.find((art) => art.id === draggbleId);
        if (art) {
            const currentTemplate = artGalleryTemplateStore.streetcodeArtSlides
                .find((slide) => slide.template === slideTemplateNumber);
            if (currentTemplate?.streetcodeArts.find((sArt) => sArt.art.id === draggbleId)) {
                alert('Цей арт уже є в цьому слайді');
                return;
            }
            
            const isInExistingSlides = streetcodeArtSlideStore.hasArtWithId(art.id.toString(), artGalleryTemplateStore.currentTemplateIndexRedact);

            if (!isInExistingSlides) {
                artGalleryTemplateStore.setArtInSlide(slideTemplateNumber, artIndex, art as Art);
            } else {
                alert('Цей арт уже є в існуючих слайдах');
            }
        } else {
            alert('Виникла помилка. Ми не можемо розпізнати цей арт. Спробуйте ще раз або створіть баг репорт');
        }
    }
};

export default TodoDndContext;
