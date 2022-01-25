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
        "гоу",
        "разобрался",
        "разобралась",
        "знаю",
        "хочу",

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
        } else {
            this.botUsers[user].stage = 0;
        }
        
        await ctx.reply("Привет!\nЯ помогу тебе подготовиться к предстоящему собеседованию!\nПриступим?");


    }

    getUser = (id: number): BotUser => {
        return this.botUsers[id];
    }

    updateUserStage = (id: number, stage: number): void => {
        this.botUsers[id].stage = stage;
    }

    checkMessage = (msg: any): boolean | null => {
        let answY = this.botYes.find((value) => value == msg.toLowerCase()) && 1;
        let answN = this.botNo.find((value) => value == msg.toLowerCase()) && 1;

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
                ctx.reply("Отлично!\n"+
                "Первым и важным этапом в подготовке является проверка твоих профессиональных навыков. Если твоя будущая работа связана с техническими и профессиональными вопросами – подготовь ответы на них, повтори теорию и обязательно сделай тестовые задания.\n"+
                "Если для твоей будущей работы не нужны специальные знания – то первым делом подробно изучи вакансию и предположи, что может заинтересовать работодателя. Обязательно отметь для себя моменты, которые вызывают у тебя вопросы, чтобы задать их на собеседовании.\n"+
                "Ты разобрался(лась) в вакансии и знаешь, куда ты идешь?");
                this.updateUserStage(user.id, ++user.stage);
                break;
            }
            case 2: {
                switch(this.checkMessage(ctx.message.text)) {
                    case true: {
                        ctx.reply("Ты уже на шаг ближе к будущей работе!\n"+
                        "Внизу ты видишь список вопросов, которые по моей статистике чаще всего встречаются на собеседовании и могут встретиться тебе. Можешь на них ответить. Это будет хорошей тренировкой!\n\n"+
                        
                        "- Какой Вы человек? Расскажите о себе.\n"+
                        "- Что Вы считаете своим достижением? Назовите Ваши профессиональные достижения?\n" +
                        "- Назовите Ваши сильные и слабые стороны характера?\n" +
                        "- Какие Ваши качества помогут Вам в работе?\n" +
                        "- Вы конфликтный человек?\n "+
                        "- Вы коммуникабельны? Вы легко находите общий язык с людьми? Какую позицию Вы занимаете в коллективе? \n"+
                        "- Что вызывает у Вас трудности в работе?\n"+
                        "- Что Вы ждете от новой работы?\n\n"+
                        
                        "Обрати внимания на следующие вопросы, которые могут вызвать сложность:\n"+
                        "- Где Вы видите себя через n лет?\n"+
                        "- Расскажите о Вашем опыте работы? Почему Вы ушли или Вас уволили с предыдущей работы?\n"+
                        "- Вспомните о Вашем провале, о какой-то ошибке на работе. \n" +
                        "- Что Вы купите на первую зарплату? Для чего хотите заработать денег? \n\n"+

                        "Теперь перейдем к последнему этапу подготовки!");
                        this.updateUserStage(user.id, ++user.stage);
                        break;
                    }
                    case false: {
                        ctx.reply("Тогда прочитай мои советы выше и выполни рекомендации. Все получится!\n"+
                        "Если готов(а) идти дальше – подтверди это.");
                        break;
                    }
                    case null: {
                        ctx.reply(`Прости, я тебя не понимаю`);
                        break;
                    }
                }
                break;
            }
            case 3: {
                ctx.reply("Теперь ты лучше знаешь правила собеседования и понимаешь, что может тебя ожидать.\n" +
                "Запомни – главное быть собой. А для этого лучше не волноваться. Чтобы не волноваться, попробуй встать перед зеркалом и потренировать свою речь, и ты поймешь, что это не страшно! Обязательно выспись перед собеседованием и продумай свой внешний вид в соответствии с требованиями и местом проведения интервью. \n"+
                "Верю в тебя. Успехов!");
                this.updateUserStage(user.id, ++user.stage);
                break;
            }
        }
    }   

    launchBot = async(): Promise<void> => {
        await this.bot.launch();
    }
}