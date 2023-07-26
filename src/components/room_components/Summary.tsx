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

const chunkData = [
    "2020년, 게이트라는 미지의 차원과 연결된 문이 열려 세계에 변화가 발생함.",
    "첫 생존자인 헌터들의 등장으로 몬스터와의 전투가 시작되고 세계는 파괴 위협을 겪음.",
    "퍼스트 헌터들과 후원자들로 인해 세상이 반격을 시작하고 헌터들의 성장과 노력으로 세계를 구원함.",
    "최악의 게이트 '게헤나'가 발생하고 열두 영웅들의 등장으로 세계는 다시 위험에 빠짐.",
    "열두 영웅들에 의해 세상은 변화하고 에덴이 만들어짐.",
    "그러나 잊혀진 마왕과 그의 마법서에 대한 진실은 한 명의 헌터만이 알고 있음.",
];

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
        setSummaryArraySet((prev) => {
            prev = [...chunkData];
            return chunkData;
        });

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
