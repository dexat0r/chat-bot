import { Context, Telegraf, Markup } from "telegraf";
import { Stage } from "../../models/interfaces";
import yes from "../../models/text/agree";
import no from "../../models/text/disagree";
import replies from "../../models/text/replies";
import training from "../../models/text/training";
import User from "../../models/user";
import { BotUsers } from "./interfaces";

export default class BotService {
    botUsers: BotUsers = {};
    botYes = yes;
    botNo = no;

    constructor(private readonly bot: Telegraf) {
        this.bot.start(this.startWork);
        this.bot.command("restart", this.restart);
        this.bot.hears("Обучение!", this.startLearning);
        this.bot.hears("Тренировка!", this.startTraining);
        this.bot.on("message", this.checkType);
        this.bot.use(Telegraf.log());
    }

    startWork = async (ctx: Context): Promise<void> => {
        ctx.reply(
            "Привет, выбери команду!",
            Markup.keyboard([["Обучение!", "Тренировка!"]])
                .oneTime()
                .resize()
        );
    };

    startLearning = async (ctx: Context) => {
        let user = ctx.from?.id as number;
        if (!this.botUsers[user]) {
            this.botUsers[user] = new User(user);
        } else {
            await ctx.reply(replies.requestRestart);
            return;
        }

        ctx.reply(replies.start, {
            reply_markup: {
                inline_keyboard: [
                    [Markup.button.callback("Выйти", "exitLearning")],
                ],
            },
        });

        this.bot.action("exitLearning", async (_ctx) => {
            _ctx.answerCbQuery();
            this.deleteUser(_ctx.from.id);
            this.startWork(_ctx);
            return true;
        });
    };

    startTraining = (ctx: Context) => {
        let id = ctx.from?.id as number;
        let user = this.getUser(id);
        if (!user) {
            user = this.botUsers[id] = new User(id);
        } else {
            ctx.reply(replies.requestRestart);
            return;
        }

        user.training = true;
        user.trainingScore = 0;
        user.trainingStage = 0;
        user.stage = 0;
        user.extraQuestions = 0;

        ctx.reply(training.start, {
            reply_markup: {
                inline_keyboard: [
                    [Markup.button.callback("Выйти", "exitTraining")],
                ],
            },
        });

        this.bot.action("exitTraining", async (_ctx) => {
            _ctx.answerCbQuery();
            this.deleteUser(_ctx.from.id);
            this.startWork(_ctx);
            return true;
        });
    };

    getUser = (id: number): User => {
        return this.botUsers[id];
    };

    updateUserStage = (id: number, stage: Stage): void => {
        if (stage < 7) {
            this.botUsers[id].stage = stage;
        }
    };

    pauseOrUnpause = (id: number): void => {
        this.botUsers[id].pause = !this.botUsers[id].pause;
    };

    deleteUser = (id: number): void => {
        if (this.getUser(id)) {
            delete this.botUsers[id];
        }
    };

    checkType = (ctx: Context) => {
        const user = this.getUser(ctx.from?.id as number);
        if (!user) {
            ctx.reply(replies.notFound);
            return;
        }

        if (user.training) {
            this.checkTrainingStageAndReply(ctx);
        } else {
            this.checkLearningStageAndReply(ctx);
        }
    };

    checkMessage = (msg: any): boolean | null => {
        let answY =
            this.botYes.find((value) => value == msg.toLowerCase()) && 1;
        let answN = this.botNo.find((value) => value == msg.toLowerCase()) && 1;

        return answY ? true : answN ? false : null;
    };

    checkTrainingStageAndReply = async (ctx: any) => {
        const user = this.getUser(ctx.from?.id as number);
        if (!user) {
            ctx.reply(replies.notFound);
            return;
        }

        if (user.trainingStage == 0) {
            switch (this.checkMessage(ctx.message.text)) {
                case true: {
                    ctx.reply((training.stages[0] as any).text);
                    user.trainingStage++;
                    return;
                }
                case false: {
                    ctx.reply(replies.refuse);
                    this.deleteUser(user.id);
                    return;
                }
                case null: {
                    ctx.reply(replies.notUnderstood);
                    return;
                }
            }
        }

        switch (true) {
            case !Array.isArray(training.stages[user.trainingStage]): {
                const valid = (
                    training.stages[user.trainingStage - 1] as any
                ).validation(ctx.message.text);
                if (valid) user.trainingScore++;
                ctx.reply((training.stages[user.trainingStage] as any).text);
                user.trainingStage++;
                break;
            }
            case user.extraQuestions < 5: {
                const length = (training.stages[user.trainingStage] as any)
                    .length;
                const rand = Math.floor(Math.random() * (length - 0) + 0);
                const valid = (training.stages[user.trainingStage] as any)[
                    rand
                ].validation(ctx.message.text);
                if (valid) user.trainingScore++;
                ctx.reply(
                    (training.stages[user.trainingStage] as any)[rand].text
                );
                user.extraQuestions++;
                break;
            }
            case (!user.isAnswering): {
                switch(this.checkMessage(ctx.message.text)) {
                    case true: {
                        const marks = Object.keys(training.results);
                        const result = marks.filter((mark) => user.trainingScore > Number(mark));
                        await ctx.reply((training.results as any)[result[result.length - 1]]);
                        this.deleteUser(user.id);
                        //left text
                        break;
                    }
                    case false: {
                        await ctx.reply(training.leave);
                        this.deleteUser(user.id);
                        break;
                    }
                    case null: {
                        ctx.reply(replies.notUnderstood);
                        return;
                    }
                }
                break;
            }
            default: {
                user.isAnswering = false;
                ctx.reply(training.finish);
            }
        }

    };

    checkLearningStageAndReply = async (ctx: any): Promise<void> => {
        const user = this.getUser(ctx.from?.id as number);
        if (!user) {
            ctx.reply(replies.notFound);
            return;
        }

        switch (this.checkMessage(ctx.message.text)) {
            case true: {
                if (user.pause) {
                    this.pauseOrUnpause(user.id);
                }
                ctx.reply(replies.stages[user.stage]);
                this.updateUserStage(user.id, ++user.stage as Stage);
                break;
            }
            case false: {
                if (user.pause || user.stage == 0) {
                    ctx.reply(replies.refuse);
                    this.deleteUser(user.id);
                } else {
                    ctx.reply(replies.pause);
                    this.pauseOrUnpause(user.id);
                    this.updateUserStage(user.id, --user.stage as Stage);
                }
                break;
            }
            case null: {
                ctx.reply(replies.notUnderstood);
                break;
            }
        }
    };

    restart = (ctx: Context): void => {
        const user = this.getUser(ctx.from?.id as number);

        if (user) {
            this.deleteUser(user.id);
            ctx.reply(replies.restart);
        } else {
            ctx.reply(replies.notFound);
        }
    };

    launchBot = async (): Promise<void> => {
        await this.bot.launch();
    };

    training = async () => {
        const data = {};
    };
}
