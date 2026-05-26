import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import {getCommands} from "./utils/commands_path.js";

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        const commands = await getCommands();
        const deployData = commands.map(cmd => cmd.data.toJSON());
        const guildIds: string[] = []; // Input những ID server muốn vào

        for (const guildId of guildIds) {
            await rest.put(
                Routes.applicationGuildCommands(config.applicationId, guildId),
                {body: deployData},
            );
            console.log(`Các server được cập nhật gồm: ${guildId} và ${deployData.length} lệnh đã được cập nhật thành công`);
        }
    } catch (error) {
        console.error('Lỗi khi deploy lệnh:', error);
    }
})();
