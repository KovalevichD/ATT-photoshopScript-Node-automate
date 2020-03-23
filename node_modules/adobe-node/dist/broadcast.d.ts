import { BroadcastBuilder, BroadcastMessage, Config } from "./api";
export declare const newBroadcastBuilder: (config: Config) => BroadcastBuilder;
export declare const broadcast: (host: string, port: number, message: BroadcastMessage) => void;
