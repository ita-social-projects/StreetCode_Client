import { Input } from "antd";
import React from "react";

const SubtitleBlock = () => {
    
    return(
        <div className="adminContainer-block">
            <h2>Subtitle</h2>
            <Input maxLength={500} showCount />
        </div>
    )
}

export default SubtitleBlock