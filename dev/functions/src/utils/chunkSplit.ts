export const chunkSplit = (str: string, len: Number, end: string) => {
    const match = str.match(new RegExp('.{0,' + len + '}', 'g'));
    if (!match) {
        return '';
    }

    return match.join(end);
}