/**
 * Chặt nhỏ một chuỗi dài thành mảng các chuỗi ngắn hơn (mặc định 1024 ký tự).
 * Ưu tiên cắt tại các dấu xuống dòng (\n) để không làm đứt đoạn văn/từ vựng.
 * * @param text Chuỗi văn bản cần cắt
 * @param maxLength Giới hạn ký tự tối đa (Discord mặc định là 1024)
 */
export function splitIntoChunks(text: string, maxLength: number = 1024): string[] {
    if (!text) return [];
    if (text.length <= maxLength) return [text];

    const chunks: string[] = [];
    const lines = text.split('\n');
    let currentChunk = '';

    for (const line of lines) {
        if (line.length > maxLength) {
            if (currentChunk) {
                chunks.push(currentChunk);
                currentChunk = '';
            }
            let remaining = line;
            while (remaining.length > 0) {
                chunks.push(remaining.substring(0, maxLength));
                remaining = remaining.substring(maxLength);
            }
        } 
        else if (currentChunk.length + line.length + 1 > maxLength) {
            chunks.push(currentChunk);
            currentChunk = line;
        } 
        else {
            currentChunk += (currentChunk === '' ? '' : '\n') + line;
        }
    }
    if (currentChunk) {
        chunks.push(currentChunk);
    }
    return chunks;
}