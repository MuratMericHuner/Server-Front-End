import { Status } from "../enum/status.enum";

export interface Server{
    serverId: number;
    ipAddress: string;
    name: string;
    memory: string;
    type: string;
    status : Status;
}