import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getCommands() {
    const commands: Array<{ [key: string]: any }> = [];
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const commandModule = await import(fileUrl);
        const command = commandModule.default || Object.values(commandModule)[0];
        if (command && 'data' in command) {
            commands.push(command);
        } else {
            console.log(`File ${file} đang thiếu thuộc tính "data". Đã bỏ qua file này`);
        }
    }
    return commands;
}