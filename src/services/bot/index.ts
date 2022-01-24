import { Context, Telegraf } from "telegraf";
import { BotUser } from "./interfaces";

export default class BotService {

    botUsers: { [key: string]: BotUser } = {};
    botYes =  [
        "да", 
        "ага", 
        "угу", 
        "yes", 
        "конечно", 
        "приступим", 
        "го", 
        "гоу"
    ];
    botNo = [
        "нет",
    ]

    constructor(
        private readonly bot: Telegraf
    ) {
        this.init();
    }

    init() {
        this.bot.start(this.startWork);
        this.bot.on("message", this.checkStageAndReply)
    }

    startWork = async (ctx: Context): Promise<void> => {
        let user = ctx.from?.id as number;

        if (!this.botUsers[user]) {
            this.botUsers[user] = {
                id: user,
                stage: 0
            };
        }

        await ctx.reply("Привет!\nЯ помогу тебе подготовиться к предстоящему собеседованию!\nПриступим?");
    }

    getUser = (id: number): BotUser => {
        return this.botUsers[id];
    }

    updateUserStage = (id: number, stage: number): void => {
        this.botUsers[id].stage = stage;
    }

    checkMessage = (ctx: any): boolean | null => {
        let answY = this.botYes.find((value) => value == msg) && 1;
        let answN = this.botNo.find((value) => value == msg) && 1;

        return answY ? true : answN ? false : null;
    }

    checkStageAndReply = async (ctx: any): Promise<void> => {
        const user = this.getUser(ctx.from?.id as number);
        switch (user.stage) {
            case 0: {
                switch(this.checkMessage(ctx.message.text)) {
                    case true: {
                        ctx.reply(`Для начала попробуй ответить в своей голове на вопросы:\n- Знаю ли я, что от меня будут требовать на выбранной должности?\n- Знаком ли я с компанией, в которую собираюсь устраиваться на работу?\nЕсли вопросы тебя озадачили – тогда, в первую очередь, начни с изучения своей должности. Почитай информацию о компании, попробуй найти что-то новое, что тебя заинтересует.\nЕсли ты хочешь идти дальше – сообщи мне об этом.`);
                        this.updateUserStage(user.id, ++user.stage);
                        break;
                    }
                    case false: {
                        ctx.reply(`Тогда, я надеюсь, ты сам(а) справишься. Желаю успехов!\nЕсли что, я всегда готов помочь.\n`);
                        //stop bot for user
                        break;
                    }
                    case null: {
                        ctx.reply(`Прости, я тебя не понимаю`);
                        break;
                    }
                }
                break;
            }
            case 1: {
                
            }
        }
    }   

    launchBot = async(): Promise<void> => {
        await this.bot.launch();
    }
}