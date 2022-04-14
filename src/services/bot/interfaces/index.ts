import { BotUser } from "../../../models/interfaces"

export type BotUsers = {
    [key: string] : BotUser
}


export type TrainingData = {
    score: number,
    stage: number,
}