const axios = require("axios");
const apiKey = require("./key");

async function imageAi(base64Image, language, model, win) {
  win.webContents.send("ai-response", "Loading...");

  const payload = {
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // or 'image/png' depending on your image
              data: base64Image,
            },
          },
          {
            text: `Solve this using ${language} in a optimized way and give me answer in following format, what is problem statement, whats the solution and explanation of solution,an alternate solution and whats the time and space complexity, is there any other way to improve this`,
          },
        ],
      },
    ],
  };

  console.log(`using ${language}, model: ${model}`);
  console.log("key", apiKey);
  console.log("Uploading image");

  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    win.webContents.send("ai-response", text || "No conent, Try again");
  } catch (err) {
    const er = err.response?.data || err.message;
    console.error("Error:", er);
    win.webContents.send("ai-response", er);
  }
}

module.exports = { imageAi };
