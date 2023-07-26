import { useRecoilState, useRecoilValue } from "recoil";
import React, { useEffect } from "react";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from "react-beautiful-dnd";
import styled from "styled-components";
import { AuthLogin, SummaryAtom } from "../../atoms";

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

//! summay 클릭시 fetch로 summary 데이터를 가져옴.
//! 가져온 데이터를 배열로 바꾼후 (. 기준 혹은 다른 기준을 정해야 할듯)
function Summary() {
    const [userState, setUserState] = useRecoilState(AuthLogin);
    const [SummaryArray, setSummaryArraySet] = useRecoilState(SummaryAtom);

    const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
        if (!destination) return;
        setSummaryArraySet((oneLine) => {
            const copySummary = [...oneLine];
            // 1. delete item in source.index
            copySummary.splice(source.index, 1);
            // 2. insert item in destination.index
            copySummary.splice(destination?.index, 0, draggableId);
            return copySummary;
        });
    };
    useEffect(() => {
        const sendRequest = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/room/${userState.currentRoom.room_id}/summary`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: " Bearer " + userState.token,
                        },
                    }
                );

                const responseData = await response.json();
                if (!response.ok) {
                    throw new Error(responseData.message);
                }
                setSummaryArraySet((prev) => {
                    prev = [...responseData.summary];
                    return responseData.summary;
                });
                console.log(responseData);
            } catch (err) {
                console.log(err);
            }
        };
        sendRequest();
    }, []);
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <Droppable droppableId="one">
                    {(provided) => (
                        <Board
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {SummaryArray.map((oneLine, index) => (
                                // draggable 에서 key와 draggableId는 동일해야함
                                // 그렇지 않으면 버그 발생
                                <Draggable
                                    key={oneLine}
                                    draggableId={oneLine}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {oneLine}
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
