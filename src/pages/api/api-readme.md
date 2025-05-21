Market Multiplier API Documentation

🔐 API Key Authentication Guide

📌 Setting Up Your API Key

Open .env.local in the project root and add your OpenAI API key:

OPENAI_API_KEY=your-api-key-here

Save the file and restart Next.js:

Ctrl + C  # Stop the server
npm run dev  # Restart it

🚀 Debugging API Key Issues

If the API returns Missing API Key or Forbidden (403), follow these steps:

✅ 1. Confirm the API Key is Loaded in Next.js

Open content-humanizer.ts and add this log at the top:

console.log("🔍 Expected API Key:", process.env.OPENAI_API_KEY);

Restart the server (npm run dev) and check the terminal output.

✅ If it prints:

🔍 Expected API Key: sk-proj-XXXXXXXXXXXXXXXXXXXXXXXX

The key is loaded correctly.

❌ If it prints:

🔍 Expected API Key: undefined

Your .env.local isn’t being read. Make sure:

The file is named exactly .env.local (not .env or env.local).

The key is formatted correctly with no spaces before/after =.

✅ 2. Ensure the API Key is Sent in the Request

When making requests to the API, include the API key in the Authorization header:

Postman:

Go to Headers tab and add:

Key: Authorization
Value: Bearer your-api-key-here

Send the request.

Curl (Command Line):

curl -X GET "http://localhost:3000/api/content-humanizer" \
     -H "Authorization: Bearer your-api-key-here"

JavaScript (fetch() in Browser Console):

fetch("http://localhost:3000/api/content-humanizer", {
  method: "GET",
  headers: {
    "Authorization": "Bearer your-api-key-here"
  }
})
.then(response => response.json())
.then(data => console.log("API Response:", data))
.catch(error => console.error("Error:", error));

✅ 3. Fix the "Bearer " Issue

If you see the 403 Forbidden error, check the logs:

🔍 Received API Key: "Bearer sk-proj-XXXXXXXXXXXXXXXXXXXXXXXX"
🔍 Expected API Key: "sk-proj-XXXXXXXXXXXXXXXXXXXXXXXX"

The API is receiving the full "Bearer " string, so it doesn’t match.

📌 Fix

Modify your authenticate() function to strip out "Bearer ":

const token = authHeader.replace("Bearer ", "").trim();

Now, it will correctly compare the API key without "Bearer ".

🎯 Final Checklist Before Testing

✅ .env.local has the correct key with no spaces or quotes✅ Restarted the server after modifying .env.local (npm run dev)✅ Checked terminal logs to confirm the key is loading correctly✅ Sending the API key as "Bearer your-api-key-here" in Postman, Curl, or Fetch✅ Stripping "Bearer " from the authentication check in content-humanizer.ts

🚀 If Everything is Correct, Your API Will Work!

If you still run into issues, check your logs and compare the expected vs. received API key.