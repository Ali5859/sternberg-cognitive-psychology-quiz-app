import { GoogleGenAI, Type } from "@google/genai";
import { Question, UserAnswer } from "../types";
import { QUIZ_QUESTION_COUNT } from "../constants";

const getAiClient = () => {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
        throw new Error("API Key not found. Please set it in the application settings.");
    }
    return new GoogleGenAI({ apiKey });
};

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.STRING },
        questionText: { type: Type.STRING },
        options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
        },
        correctAnswer: { type: Type.STRING },
        explanation: { type: Type.STRING },
        topic: { type: Type.STRING },
    },
    required: ["id", "questionText", "options", "correctAnswer", "explanation", "topic"]
};

export const generateQuizQuestions = async (chapterTitle: string, difficulty: string): Promise<Question[]> => {
    const prompt = `شما یک متخصص روانشناسی شناختی و طراح سوالات آزمون در سطح دانشگاه هستید. بر اساس کتاب "روانشناسی شناختی" استرنبرگ، ${QUIZ_QUESTION_COUNT} سوال چندگزینه‌ای برای فصل با عنوان "${chapterTitle}" طراحی کنید. سطح دشواری سوالات باید **${difficulty}** باشد. تمام خروجی‌ها باید به زبان فارسی باشد. برای هر سوال، موارد زیر را ارائه دهید:
- یک 'id' منحصر به فرد به صورت رشته.
- 'questionText': متن کامل سوال به فارسی.
- 'options': یک آرایه شامل چهار گزینه متمایز به فارسی.
- 'correctAnswer': پاسخ صحیح به صورت رشته که باید دقیقاً یکی از گزینه‌ها باشد.
- 'explanation': توضیح مختصر و مفید برای پاسخ صحیح به فارسی.
- 'topic': یک یا دو کلمه کلیدی به عنوان موضوع سوال از داخل فصل به فارسی.
سوالات باید چالش‌برانگیز بوده و مفاهیم مختلفی از فصل را پوشش دهند. خروجی را در قالب یک JSON ساختاریافته ارائه دهید.`;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: questionSchema,
                },
            },
        });

        const jsonString = response.text.trim();
        const questions = JSON.parse(jsonString);

        if (!Array.isArray(questions) || questions.length === 0) {
            throw new Error("API returned an invalid format for questions.");
        }
        
        return questions as Question[];

    } catch (error) {
        console.error("Error generating quiz questions:", error);
        if (error instanceof Error && error.message.includes("API Key not found")) {
            throw error;
        }
        throw new Error("Failed to generate quiz questions from the API.");
    }
};

export const getPerformanceAnalysis = async (questions: Question[], userAnswers: UserAnswer[], chapterTitle: string): Promise<string> => {
    const formattedResults = questions.map(q => {
        const userAnswer = userAnswers.find(a => a.questionId === q.id);
        return `
- Question (Topic: ${q.topic}): ${q.questionText}
  - Correct Answer: ${q.correctAnswer}
  - User's Answer: ${userAnswer?.selectedAnswer || 'Not answered'}
  - Result: ${userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
        `;
    }).join('');

    const prompt = `As an expert cognitive psychology tutor, analyze the following quiz results in Persian. The user was tested on the chapter "${chapterTitle}". Here are the questions, their topics, and the user's answers:
${formattedResults}

Based on this performance, identify the user's specific strengths and weaknesses. Group your analysis by topic. Provide clear, concise, and encouraging feedback in Persian. Start with an overall summary, then list the strengths, and finally list the areas for improvement with suggestions. Format the output as clean markdown.
Use these headers in Persian:
### خلاصه عملکرد
### نقاط قوت
### زمینه‌های بهبود
`;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error getting performance analysis:", error);
        if (error instanceof Error && error.message.includes("API Key not found")) {
            throw error;
        }
        throw new Error("Failed to get performance analysis from the API.");
    }
};