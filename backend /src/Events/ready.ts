import { IGatewayEvent } from "../../lib/bot/bot.js";
import { DiscordBot } from "../../lib/bot/BaseBotClass.js";
import { CronUpdateBotPing, updateStatusDatabase } from "../../lib/api/routes/StatusEndpoint.js";

const event: IGatewayEvent = {
    name: 'ready',
    once: false,
    execute: (client: DiscordBot) => {
        setTimeout(async() => {
            updateStatusDatabase("BOT", client.ws.ping)
        },5000)

        CronUpdateBotPing(client)
    },
}

export default event;
