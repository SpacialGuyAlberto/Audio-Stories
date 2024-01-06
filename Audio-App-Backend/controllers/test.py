# # 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

# from openai import OpenAI
# from datetime import datetime

# start = datetime.now()
# print(start)


# client = OpenAI(
#     api_key= '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',
#     organization='org-V1q1pWiIxPdI1WokaKWMHhnI'
# )
# response = client.chat.completions.create(
#   model="gpt-3.5-turbo-1106",
#   response_format={ "type": "json_object" },
#   messages=[
#     {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
#     {"role": "user", "content": "Write a short story of a rabbit who changed the world. thanks."}
#   ]
# )

# print(response.choices[0].message.content)

# end = datetime.now()
# print(end)
# timeDifference = end - start

# print(timeDifference)