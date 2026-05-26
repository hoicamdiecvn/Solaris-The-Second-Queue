import { REST, Routes } from 'discord.js';
import { config } from './config.js';
import {getCommands} from "./utils/commands_path.js";

const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
    try {
        const commands = await getCommands();
        const deployData = commands.map(cmd => cmd.data.toJSON());
        await rest.put(
            Routes.applicationCommands(config.applicationId),
            { body: deployData },
        );
        console.log(`Cập nhật thành công ${deployData.length} lệnh`);
    } catch (error) {
        console.error('Lỗi khi deploy lệnh:', error);
    }
})();
