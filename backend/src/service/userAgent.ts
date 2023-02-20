// 사용 안함

import { mongoose } from "../config/plugins";
import useragent from "express-useragent";
import Agent from "../models/agent";

const AgentData = (req: any) => {
    
    const user = useragent.parse(req.headers["user-agent"]);

}

export default AgentData;