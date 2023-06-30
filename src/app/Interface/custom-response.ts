import { Server } from "./Server";

export interface CustomResponse{
    timeStamp: Date;
    statusCode: number;
    status : string;
    reason:string;
    message:string;
    devmessage: string;
    data : {servers? : Server[], server? : Server};
}