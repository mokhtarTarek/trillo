import openai from "@/openai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    // todos in the body of the post request
    const { todos } = await request.json()
    console.log(todos)
    // commnicate with open ai

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        n: 1,
        stream: false,
        messages: [
            {
                "role": "system",
                "content": `when responding, welcome the user always as Mr Mokhtar and remember the user that if his job to eat a frog then it's better to do it first in the morning!
                Limit the response to 200 characters
                `
            },
            {
                role: "user",
                content: `Hi there, provide a summary of the following todos,Count how many todos are in each category such as To do, in progress and done, then tell the user to have a productive day! Here's the data : ${JSON.stringify(todos)}`

            }
        ],
    });
    console.log("DATA IS :", chatCompletion)
    console.log(chatCompletion.choices[0].message)
    return NextResponse.json(chatCompletion.choices[0].message)

}