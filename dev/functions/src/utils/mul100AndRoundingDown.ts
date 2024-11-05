export const mul100AndRoundingDown = (x: number) => {
    const mul100 = x * 100; // ex) 0.9988を99.88にする
    const result = Math.floor(mul100); // 数字を丸める
    return result;
}