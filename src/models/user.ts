import { BotUser, Stage, TrainingStage } from "./interfaces";

export default class User implements BotUser{

    id: number
    stage: Stage
    pause: boolean
    trainingStage: number;
    trainingScore: number
    training: boolean
    extraQuestions: number
    isAnswering: boolean
    badSpelling: boolean
    extraQuestionsArr: number[]

    constructor(id: number) {
        this.id = id;
        this.stage = 0;
        this.pause = false;
        this.trainingStage = 0;
        this.trainingScore = 0;
        this.training = false;
        this.extraQuestions = -1;
        this.isAnswering = true;
        this.badSpelling = false;
        this.extraQuestionsArr = []
    }

}