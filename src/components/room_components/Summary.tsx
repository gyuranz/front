import { useRecoilState, useRecoilValue } from "recoil";
import React from "react";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { toDoState } from "../../atoms";

const Board = styled.div`
    padding: 20px 10px;
    padding-top: 30px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 5px;
    min-height: 200px;
`;

const Card = styled.div`
    margin-bottom: 5px;
    background-color: rgba(255, 255, 255, 0.2);
    padding: 3px 3px;
`;

function Summary() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
        if (!destination) return;
        setToDos((oldToDos) => {
            const copyToDos = [...oldToDos];
            // 1. delete item in source.index
            copyToDos.splice(source.index, 1);
            // 2. insert item in destination.index
            copyToDos.splice(destination?.index, 0, draggableId);
            return copyToDos;
        });
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <Droppable droppableId="one">
                    {(provided) => (
                        <Board
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {toDos.map((toDo, index) => (
                                // draggable 에서 key와 draggableId는 동일해야함
                                // 그렇지 않으면 버그 발생
                                <Draggable
                                    key={toDo}
                                    draggableId={toDo}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {toDo}
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Board>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}

export default React.memo(Summary);
