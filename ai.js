const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const API_KEY = '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'
const endpoint = 'https://openrouter.ai/api/v1/chat/completions';


 async function imageAi(base64Image,apiKey,win) {
  const imageUrl = 'https://yourdomain.com/sample.jpg'; // public image link

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

 function sendToChatGPTImage(base64Image,apiKey,win) {
  const data = {
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: [
        { type: 'text', text: 'What do you see in this image?' },
        {
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${base64Image}`
          }
        }
      ]
    }],
    max_tokens: 1000
  };

  axios.post('https://api.openai.com/v1/chat/completions', data, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }).then(res => {
    win.webContents.send('ai-response', res.data.choices[0].message.content);
  }).catch(err => {
    win.webContents.send('ai-response', 'OpenAI error: ' + (err.response?.data?.error?.message || err.message));
  });
 }

 function sendToChatGPTAudio(buffer,apiKey,win) {
  const formData = new FormData();
  formData.append('file', buffer, {
    filename: 'voice.wav',
    contentType: 'audio/wav'
  });
  formData.append('model', 'whisper-1');
  axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
    headers: {
      ...formData.getHeaders(),
      'Authorization': `Bearer ${apiKey}`
    }
  }).then(res => {
    sendTextToChatGPT(res.data.text,apiKey,win);
  }).catch(err => {
    win.webContents.send('ai-response', 'Whisper error: ' + (err.response?.data?.error?.message || err.message));
  });
}

function sendTextToChatGPT(prompt,apiKeywin) {
  axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  }).then(res => {
    win.webContents.send('ai-response', res.data.choices[0].message.content);
  }).catch(err => {
    win.webContents.send('ai-response', 'ChatGPT error: ' + (err.response?.data?.error?.message || err.message));
  });
}


module.exports = { imageAi,sendToChatGPTImage,sendToChatGPTAudio };