import { GoogleGenerativeAI } from '@google/generative-ai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: {
        responseMimeType: "application/json",
    }
});

export async function analyzeTextWithGemini(messageContent: string) {
    try {
        const promptPath = path.resolve(process.cwd(), 'src/utils/japanese_prompt.txt');
        const systemPrompt = fs.readFileSync(promptPath, 'utf-8');
        const finalPrompt = `${systemPrompt}\n"${messageContent}"`;

        console.log('[Gemini] Đang gửi yêu cầu phân tích...');
        const result = await model.generateContent(finalPrompt);
        const responseText = result.response.text();
        const parsedData = JSON.parse(responseText);
        return parsedData;

    } catch (error) {
        console.error('[Gemini] Lỗi khi xử lý:', error);
        throw new Error('Không thể phân tích bằng AI lúc này.');
    }
}