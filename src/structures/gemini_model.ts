import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const FALLBACK_MODELS = [
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash',
    'gemini-3.1-flash-lite'
];

export async function generateJSONWithFallback(prompt: string) {
    let lastError: any = null;
    for (const modelName of FALLBACK_MODELS) {
        try {
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });
            const result = await model.generateContent(prompt);
            return {
                text: result.response.text(),
                modelUsed: modelName
            };
        } catch (error: any) {
            lastError = error;
            const isServerBusy = error.message && (error.message.includes('503') || error.message.includes('500'));
            if (isServerBusy) {
                console.warn(`[Cảnh báo] Model ${modelName} đang quá tải, tự động chuyển model tiếp theo...`);
                continue;
            } else {
                throw error; 
            }
        }
    }
    throw new Error(`[Sập toàn tập] Tất cả các model dự phòng đều đang quá tải. Lỗi cuối cùng: ${lastError?.message}`);
}

export async function analyzeTextWithGemini(messageContent: string, srcLanguagesPrompt : string) {
    try {
        const promptPath = path.resolve(process.cwd(), srcLanguagesPrompt);
        const systemPrompt = fs.readFileSync(promptPath, 'utf-8');
        const finalPrompt = `${systemPrompt}\n"${messageContent}"`;

        console.log('[Gemini] Đang gửi yêu cầu phân tích...');
        const { text, modelUsed } = await generateJSONWithFallback(finalPrompt);
        const parsedData = JSON.parse(text);
        return {
            data: parsedData,
            modelUsed: modelUsed
        };

    } catch (error) {
        console.error('[Gemini] Lỗi khi xử lý:', error);
        throw new Error('Không thể phân tích bằng AI lúc này.');
    }
}