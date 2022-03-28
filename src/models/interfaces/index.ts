import replies from "../text/replies";

export type Stage = keyof typeof replies.stages;

export interface BotUser {
    id: number, 
    stage: Stage,
    pause: boolean
}