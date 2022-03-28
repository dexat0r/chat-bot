import { Context, Telegraf } from "telegraf";
import { Stage } from "../../models/interfaces";
import yes from "../../models/text/agree";
import no from "../../models/text/disagree";
import replies from "../../models/text/replies";
import User from "../../models/user";
import { BotUsers } from "./interfaces";

export default class BotService {
    botUsers: BotUsers = {};
    botYes = yes;
    botNo = no;

    constructor(private readonly bot: Telegraf) {
        this.bot.start(this.startWork);
        this.bot.command("restart", this.restart)
        this.bot.on("message", this.checkStageAndReply);
    }

    startWork = async (ctx: Context): Promise<void> => {
        let user = ctx.from?.id as number;
        if (!this.botUsers[user]) {
            this.botUsers[user] = new User(user);
        } else {
            ctx.reply(replies.requestRestart);
            return;
        }

        await ctx.reply(replies.start);
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
    }

    deleteUser = (id: number): void => {
        if (this.getUser(id)) {
            delete this.botUsers[id];
        }
    }

    checkMessage = (msg: any): boolean | null => {
        let answY =
            this.botYes.find((value) => value == msg.toLowerCase()) && 1;
        let answN = this.botNo.find((value) => value == msg.toLowerCase()) && 1;

        return answY ? true : answN ? false : null;
    };

    checkStageAndReply = async (ctx: any): Promise<void> => {
        const user = this.getUser(ctx.from?.id as number);
        if (!user) {
            ctx.reply(replies.notFound);
            return;
        }

        switch (this.checkMessage(ctx.message.text)) {
            case true: {
                if(user.pause) {
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
                    this.updateUserStage(user.id, --user.stage as Stage)
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
            this.deleteUser(user.id)
            ctx.reply(replies.restart);
        } else {
            ctx.reply(replies.notFound);
        }
    }

    launchBot = async (): Promise<void> => {
        await this.bot.launch();
    };
}
