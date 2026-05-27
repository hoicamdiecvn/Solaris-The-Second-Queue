import { SlashCommandBuilder } from 'discord.js';
import type { DiscordCommand } from '../structures/types.js';
import { toggleLogState, getLogState } from '../utils/logState.js';

const ALLOWED_USER_IDS = [
    '607183227911667746',
    '328880026047086595',
];

const writelogCommand: DiscordCommand = {
    data: new SlashCommandBuilder()
        .setName('writelog')
        .setDescription('Bật hoặc tắt tính năng ghi log message'),

    async execute(interaction) {
        if (!ALLOWED_USER_IDS.includes(interaction.user.id)) {
            await interaction.reply({
                content: 'Bạn không có quyền dùng lệnh này.',
                ephemeral: true,
            });
            return;
        }

        const newState = toggleLogState();

        await interaction.reply({
            content: newState
                ? 'Đã bật ghi log message.'
                : 'Đã tắt ghi log message.',
            ephemeral: true,
        });

        console.log(`[LOG SYSTEM] Logging is now ${getLogState() ? 'ON' : 'OFF'} by ${interaction.user.tag}`);
    },
};

export default writelogCommand;
