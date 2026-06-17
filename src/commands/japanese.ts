import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from 'discord.js';
import type { DiscordCommand } from '../structures/types.js';
import { analyzeTextWithGemini } from '../structures/gemini_model.js';
import { splitIntoChunks } from '../utils/text_format.js';

const japanese: DiscordCommand = {
    data: new ContextMenuCommandBuilder()
        .setName('Phân tích Nhật Ngữ')
        .setType(ApplicationCommandType.Message),
    
    async execute(interaction) {
        if (!interaction.isMessageContextMenuCommand()) return;
        
        const targetMessage = interaction.targetMessage;
        const messageContent = targetMessage.content;
        
        if (!messageContent) {
            return interaction.reply({ content: 'Tin nhắn này không có chữ để phân tích!', ephemeral: true });
        }

        // Defer ẩn danh để không làm phiền kênh chat
        await interaction.deferReply({ ephemeral: true });
        
        try {
            const aiData = await analyzeTextWithGemini(messageContent); // Gọi Gemini API để phân tích nội dung tin nhắn

            const embed = new EmbedBuilder()
                .setColor('#ff4757')
                .setTitle('🇯🇵 Phân tích Ngữ pháp')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(
                    `**Gốc:** ${messageContent}\n` +
                    `**Hiểu là:** ${aiData.standard_vietnamese}\n` + 
                    `━━━━━━━━━━━━━━━━━━━━\n` +
                    `**Dịch nghĩa:** ${aiData.japanese_translation}\n` +
                    `**Romaji:** *${aiData.romaji}*`
                )
                .setTimestamp();

            // Render phần Ngữ pháp (có cắt chuỗi)
            if (aiData.grammar_breakdown && aiData.grammar_breakdown.length > 0) {
                const grammarText = aiData.grammar_breakdown
                    .map((item: any) => `🔹 **${item.word}** (${item.type}): ${item.explanation}`)
                    .join('\n');
                
                const grammarChunks = splitIntoChunks(grammarText, 1024);
                grammarChunks.forEach((chunk, index) => {
                    embed.addFields({ 
                        name: index === 0 ? '📝 Ngữ pháp' : '📝 Ngữ pháp (tiếp theo)', 
                        value: chunk 
                    });
                });
            }
            
            // Render phần Từ vựng (có cắt chuỗi)
            if (aiData.vocabulary_to_learn && aiData.vocabulary_to_learn.length > 0) {
                const vocabText = aiData.vocabulary_to_learn
                    .map((item: any) => `🔸 **${item.kanji || item.furigana}** (${item.furigana}): ${item.meaning}`)
                    .join('\n');
                
                const vocabChunks = splitIntoChunks(vocabText, 1024);
                vocabChunks.forEach((chunk, index) => {
                    embed.addFields({ 
                        name: index === 0 ? '📚 Từ vựng cần nhớ' : '📚 Từ vựng (tiếp theo)', 
                        value: chunk 
                    });
                });
            }
            
            await interaction.user.send({ embeds: [embed] });
            await interaction.editReply({ 
                content: '✅ Đã gửi vào tin nhắn riêng cho bạn!' 
            });

            setTimeout(async () => {
                try {
                    await interaction.deleteReply();
                } catch (error) {
                    console.error('Không thể xóa tin nhắn phản hồi:', error);
                }
            }, 5000);
            
        } catch (error) {
            console.error('[Gemini API Error]:', error);
            await interaction.editReply('Có lỗi xảy ra khi gọi Gemini API. Kiểm tra lại log server nhé!');
        }
    },
};

export default japanese;