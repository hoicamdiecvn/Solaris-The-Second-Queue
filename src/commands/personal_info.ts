import { SlashCommandBuilder } from 'discord.js';
import type { DiscordCommand } from "../structures/types.js";

const baseLink = `https://discord.com/users/`;
const personalInfo: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Lấy link profile bản thân'),

    async execute(interaction) {
        const userId = interaction.user.id;
        await interaction.reply(`Link: ${baseLink}${userId}\n<@${userId}>`);
    },
}

export default personalInfo;