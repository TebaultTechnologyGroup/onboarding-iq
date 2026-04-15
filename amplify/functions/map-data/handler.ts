import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-2" }); // Adjust region as needed

export const handler = async (event: any) => {
    const { prompt } = event.arguments;

    const input = {
        modelId: "us.anthropic.claude-haiku-4-5-20251001-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 500,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `You are a data migration expert. Map the following messy legacy data into a clean JSON object based on this schema: 
              { "accountName": string, "billingEmail": string, "mrr": number, "status": "Active" | "Pending" }. 
              
              If a value is missing, return null for that field. 

              IMPORTANT: Return ONLY the raw JSON object. Do not include markdown formatting, backticks, or "json" labels. Your response must start with { and end with }.
              
              Messy Data: "${prompt}"`
                        }
                    ]
                }
            ]
        }),
    };

    try {
        const command = new InvokeModelCommand(input);
        const response = await client.send(command);

        // Decode the response from Bedrock
        const responseBody = new TextDecoder().decode(response.body);
        const result = JSON.parse(responseBody);

        // console.log("result = " + JSON.stringify(result));

        // Extract the text content from Claude's response
        // and remove any markdown code blocks inserted by the LLM
        const cleanJson = result.content[0].text.replace(/```json|```/g, "").trim();
        return cleanJson;

    } catch (error) {
        console.error("Bedrock Error:", error);
        throw new Error("Failed to map data via AI");
    }
};