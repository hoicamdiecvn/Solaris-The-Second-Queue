let logState = false;

export function toggleLogState(): boolean {
    logState = !logState;
    return logState;
}

export function getLogState(): boolean {
    return logState;
}
