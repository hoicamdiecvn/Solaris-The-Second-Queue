import {Collection} from "discord.js";
import pingCommand from "../commands/ping.js";
import personalInfo from "../commands/personal_info.js";
import helpCommand from "../commands/help.js";

function registerCommands(botClient: any) {
    botClient.commands = new Collection();
    const commandList = [pingCommand, personalInfo, helpCommand];
    for (const command of commandList) {
        botClient.commands.set(command.data.name, command);
    }
}

export default registerCommands;
