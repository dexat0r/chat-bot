import replies from "../text/replies";
import training from "../text/training";

export type Stage = keyof typeof replies.stages;
export type TrainingStage = keyof typeof training.stages;

export interface BotUser {
    id: number, 
    stage: Stage,
    pause: boolean,
    training: boolean,
    trainingStage: number,
    trainingScore: number,
    extraQuestions: number,
    isAnswering: boolean,
    badSpelling: boolean,
    extraQuestionsArr: number[]
}