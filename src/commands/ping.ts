import { SlashCommandBuilder } from 'discord.js';
import type { DiscordCommand } from "../structures/types.js";

const pingCommand: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Kiểm tra độ trễ của bot'),

    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};

// Export Object này ra ngoài để file index.ts bốc vào dùng
export default pingCommand;