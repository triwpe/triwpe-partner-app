const BASE52_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function toBase52(value: number, length: number): string {
    let result = '';
    while (value > 0) {
        result = BASE52_CHARS[value % 52] + result;
        value = Math.floor(value / 52);
    }
    return result.padStart(length, '0');
}

export function generateCustomId(): string {
    const currentYear = new Date().getFullYear();    
    
    const yearBase52 = toBase52(currentYear, 2);    
    
    const startOfYear = new Date(currentYear, 0, 1).getTime();
    const currentTime = Date.now();
    const secondsSinceStartOfYear = Math.floor((currentTime - startOfYear) / 1000);    
    
    const secondsBase52 = toBase52(secondsSinceStartOfYear, 5);
        
    let randomChars = '';
    for (let i = 0; i < 4; i++) {
        randomChars += BASE52_CHARS.charAt(Math.floor(Math.random() * 52));
    }    
   
    const customId = `${yearBase52}${secondsBase52}${randomChars}`;
    
    return customId;
}
