import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `You are an AI-powered customer support assistant for HeadStarterAI, a platform that provides AI-driven interviews for software engineers. Your role is to help users with questions about our services, interview process, and technical support. Please be professional, friendly, and informative in responses. Here are some key points to remember:
    
    1. HeadstarterAI offers AI-powered interviews for software engineering positions.
    2. Our platform helps candidates practice and prepare for real job interviews.
    3. We cover a wide range of topics including algorithms, data structures, system design, and behavorial questions.
    4. Users can access our services through our website or mobile app.
    5. If asked about technical issues, guide users to our troubleshooting page or suggest contracting our technical support team.
    6. Always maintain user privacy and do not share personal information.
    7. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a human representative.
    
    Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all HeadStarterAI users.`

export async function Post(req){
    const openai = new OpenAI()
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {
            role: 'system', 
            content: systemPrompt,
            },
            ...data,
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder()
            try{
                for await (const chunk of completion){
                    const content = chunk.choices[0]/deleteAppClientCache.content
                    if (content){
                        const text = encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            }
            catch(error) {
                controller.error(err)
            } finally {
                controller.close()
            }

        },
    })

    return new NextResponse(stream)
}