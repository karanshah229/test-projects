import os
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

# Retrieved context from previous step
retrieved_docs = ["RAG combines retrieval and generation", "GPT models generate language"]
context = "\n".join(retrieved_docs)
question = "What is the purpose of RAG?"

# Create a prompt
prompt = f"""
You are a helpful assistant. Use the context below to answer the question.

Context:
{context}

Question: {question}
Answer:
"""

# Send to GPT
response = openai.ChatCompletion.create(
  model="gpt-4",
  messages=[{"role": "user", "content": prompt}]
)

print(response['choices'][0]['message']['content'])

