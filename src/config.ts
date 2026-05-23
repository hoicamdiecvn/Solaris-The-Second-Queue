import dotenv from 'dotenv';
import path from 'path';

// Load file .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

interface BotConfig {
    token: string;
    applicationId: string;
}

if (!process.env.DISCORD_TOKEN || !process.env.APPLICATION_ID) {
    throw new Error("Missing environment variables in .env file!");
}

export const config: BotConfig = {
    token: process.env.DISCORD_TOKEN,
    applicationId: process.env.APPLICATION_ID,
};