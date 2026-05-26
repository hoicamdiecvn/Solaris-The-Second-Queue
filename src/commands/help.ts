import { SlashCommandBuilder, type Collection } from 'discord.js';
import type { DiscordCommand } from '../structures/types.js';

const helpCommand: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Xem danh sách lệnh hiện có'),

    async execute(interaction) {
        const client = interaction.client as typeof interaction.client & {
            commands?: Collection<string, DiscordCommand>;
        };
        const commandList = client.commands
            ? [...client.commands.values()]
                .map(command => command.data.toJSON())
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(command => `\`/${command.name}\` - ${command.description}`)
                .join('\n')
            : '';

        await interaction.reply(`**Danh sách lệnh**\n${commandList || 'Chưa có lệnh nào.'}`);
    },
};

export default helpCommand;
