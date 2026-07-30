import { groq } from '@ai-sdk/groq';
import { streamText } from 'ai';

export async function POST(req: Request) {
    try {
        const prompt =
         "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. Do not include any introductory text, numbering, or explanation — return only the raw string of questions separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

        const result = streamText({
            model: groq('llama-3.1-8b-instant'),
            prompt,
        });

        return result.toTextStreamResponse();

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { success: false, message: 'Error generating suggestions' },
            { status: 500 }
        );
    }
}