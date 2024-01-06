import OpenAI from "openai";

const openai = new OpenAI(
    api_key= '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',
    organization='org-V1q1pWiIxPdI1WokaKWMHhnI'
);

async function createStory(parameter) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: `write a short story about a ${parameter} who did not wanted to eat carrot. Thanks!` }],
    model: "gpt-3.5-turbo",
  });
  console.log(completion.choices[0].message.content);
};

