import {Collection} from "discord.js";
import { getCommands } from "../utils/commands_path.js";

async function registerCommands(botClient: any) {
    botClient.commands = new Collection();
    const commands = await getCommands();
    for (const command of commands) {
        botClient.commands.set(command.data.name, command);
    }
}

export default registerCommands;
