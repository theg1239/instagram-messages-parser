export function decodeUnicode(text: string): string {
    try {
        return decodeURIComponent(escape(text));
    } catch {
        return text; 
    }
}