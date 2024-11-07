import { observer } from "mobx-react-lite";
import React, { useMemo,useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import useMobx from "@stores/root-store";

import StrictModeDroppable from "@/app/common/components/StrictModeDroppable";
import { Fact } from "@/models/streetcode/text-contents.model";

import InterestingFactsAdminModal from "./FactsAdminModal/InterestingFactsAdminModal.component";
import InterestingFactAdminItem from "./InterestingFactsAdminItem/InterestingFactsAdminItem.component";

interface Props {
  fact?: Fact;
  onChange: (field: string, value: any) => void;
}

const InterestingFactsBlock = ({ fact, onChange }: Props) => {
  const [openModal, setModalOpen] = useState<boolean>(false);
  const { factsStore } = useMobx();

  const items = useMemo(
    () => factsStore.getFactArray,
    [factsStore.getFactArray]
  );

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination!.index
    );

    factsStore.updateFactMapWithNewOrder(reorderedItems);
  };

  return (
    <div className="adminContainer-block">
      <h2>Wow-факти</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <StrictModeDroppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="textBlockButton-container"
            >
              <button
                  name="factBtn"
                  type="button"
                  className="buttonWithPlus"
                  onClick={() => {
                    setModalOpen(true);
                  }}
              >
                +
              </button>
              {items.map((f, index) => (
                <Draggable key={f.id} draggableId={`d${f.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <InterestingFactAdminItem
                        key={f.id}
                        fact={f}
                        onChange={onChange}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
      <div>
        <InterestingFactsAdminModal
          fact={fact}
          setModalOpen={setModalOpen}
          open={openModal}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default observer(InterestingFactsBlock);
