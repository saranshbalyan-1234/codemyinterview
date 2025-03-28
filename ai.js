const axios = require('axios');
const endpoint = 'https://openrouter.ai/api/v1/chat/completions';


 async function imageAi(base64Image,apiKey,win) {

  const messages = [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Solve this with the best approach in js' },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${base64Image}`
          }
        }
      ]
    }
  ];
   
   console.log("using key",apiKey)

  try {
    const res = await axios.post(
      endpoint,
      {
        model: 'anthropic/claude-3-haiku',
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
    win.webContents.send('ai-response', res.data.choices[0].message.content);
    console.log(res.data.choices[0].message.content);
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
 }




module.exports = { imageAi };