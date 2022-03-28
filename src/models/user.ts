import { BotUser, Stage } from "./interfaces";

export default class User implements BotUser{

    id: number
    stage: Stage
    pause: boolean

    constructor(id: number) {
        this.id = id;
        this.stage = 0;
        this.pause = false;
    }

}