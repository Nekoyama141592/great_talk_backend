import { Comprehend } from 'aws-sdk';
import { updateAWSConfig } from './updateAWSConfig';
import { detectDominantLanguage } from './detectDominantLanguage';
import { mul100AndRoundingDown } from './mul100AndRoundingDown';
export const detectText = async (text: string) => {
    updateAWSConfig();
    const comprehend = new Comprehend({apiVersion: '2017-11-27'});
    let detectedText = {
        "languageCode": "",
        "negativeScore": 0,
        "positiveScore": 0,
        "sentiment": "",
        "value": text,
    };

    if (!text) {
        return detectedText;
    }

    try {
        const lCode = await detectDominantLanguage(text);
        if (!lCode || lCode.trim() === "") {
            return detectedText;
        }
        if (lCode) {
            const dSparams = {
                LanguageCode: lCode,
                Text: text,
            };

            const dSdata = await comprehend.detectSentiment(dSparams).promise();
            if (dSdata && dSdata.SentimentScore?.Negative && dSdata.SentimentScore?.Positive) {
                return {
                    "languageCode": lCode,
                    "negativeScore": mul100AndRoundingDown(dSdata.SentimentScore.Negative),
                    "positiveScore": mul100AndRoundingDown(dSdata.SentimentScore.Positive),
                    "sentiment": dSdata.Sentiment ?? '',
                    "value": text,
                };
            }
        }

        return detectedText;
    } catch (error) {
        console.log(error);
        return detectedText;
    }
}