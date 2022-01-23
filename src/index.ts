import { Telegraf } from "telegraf";
import * as dotenv from 'dotenv'
dotenv.config();



async function main() {
    let botUsers: { [key: string]: boolean } = {}
    const bot = new Telegraf(process.env.TELEGRAM_API as string) 
    bot.start((ctx) => {
        if (!botUsers[ctx.from.username as string]) {
            ctx.reply(`Привет!\nЯ помогу тебе подготовиться к предстоящему собеседованию!`)
            botUsers[ctx.from.username as string] = true
        } else {
            ctx.reply(`Ты уже начал, кретин!`);
        }
    });
    
    bot.launch();
}

main()
.then(( data ) => {

})
.catch((value) => {
    process.exit(1);
})