const axios = require('axios');
const apiKey = require('./key')
const endpoint = 'https://openrouter.ai/api/v1/chat/completions';


async function imageAi(base64Image, language,model, win) {
  win.webContents.send('ai-response', 'Loading...');

  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: `Solve this using ${language} in a optimized way and give me answer in following format, what is problem statement, whats the solution and explanation of solution, and whats the time and space complexity, is there any other way to improve this` },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${base64Image}`
          }
        }
      ]
    }
  ];
  console.log(`using ${language}, model: ${model}`)
  console.log('key',apiKey)
   console.log("Uploading image")

  try {
    const res = await axios.post(
      endpoint,
      {
        model: model,
        messages: messages,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (res.data.choices?.[0]?.message) {
      const content = res.data.choices[0].message.content || res.data.choices[0].message.reasoning
      win.webContents.send('ai-response', content || "Error, Try again");
    }else{
      win.webContents.send('ai-response', "Error, Try again");
    }
    // console.log(res);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
 }




module.exports = { imageAi };