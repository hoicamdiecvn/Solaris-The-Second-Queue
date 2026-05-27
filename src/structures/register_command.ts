import {Collection} from "discord.js";
import pingCommand from "../commands/ping.js";
import personalInfo from "../commands/personal_info.js";
import writelogCommand from "../commands/writelog.js";

function registerCommands(botClient: any) {
    botClient.commands = new Collection();
    const commandList = [pingCommand, personalInfo, writelogCommand];
    for (const command of commandList) {
        botClient.commands.set(command.data.name, command);
    }
}

export default registerCommands;