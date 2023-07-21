import React from "react";

const PageReturn = () => {
    const storedData = JSON.parse(localStorage.getItem("userData") as string);
    console.log(storedData);

    return <h1>main</h1>;
};

export default PageReturn;
