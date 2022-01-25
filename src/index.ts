import { Telegraf } from "telegraf";
import * as dotenv from 'dotenv'
import BotService from "./services/bot";

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_API as string);
const botService = new BotService(bot);
botService.launchBot();
