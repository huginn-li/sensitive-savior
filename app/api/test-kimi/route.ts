import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const API_URL = process.env.MINIMAX_API_URL || 'https://api.minimaxi.com/v1/chat/completions';
const API_KEY = process.env.MINIMAX_API_KEY;
const API_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2.7';

const SYSTEM_PROMPT = `你是「说啥好呢」的 AI 助手。请用中文回复，格式如下：

## 💚 情绪安抚
（2-3句温暖的话）

## 🎯 客观分析
**影响程度：** ⭐⭐（1-5星）
（2-3个降低严重性的角度）

## 💬 找补话术

**方案A：轻松幽默型**
（适用场景 + 具体话术）

**方案B：认真解释型**
（适用场景 + 具体话术）

**方案C：转移话题型**
（适用场景 + 具体话术）`;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const apiKey = searchParams.get('api_key');
  const message = searchParams.get('message') || 'I told my boss the plan is not good';
  const targetPerson = searchParams.get('target') || 'Boss';
  const context = searchParams.get('context') || 'Meeting';
  const worry = searchParams.get('worry') || 'Will he think I am critical';

  const effectiveApiKey = apiKey || API_KEY;

  // No API key - return test page
  if (!effectiveApiKey) {
    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Kimi API Test</title>
<style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px}
input,textarea{width:100%;padding:10px;margin:10px 0;box-sizing:border-box}
button{background:#22C55E;color:white;padding:12px;border:none;width:100%;cursor:pointer}
#result{margin-top:20px;white-space:pre-wrap;background:#f0f0f0;padding:15px;overflow:auto}</style>
</head><body>
<h2>Kimi API Test</h2>
<form id="f">
<input name="api_key" placeholder="API Key (required)" required><br>
<input name="target" value="Boss" placeholder="Who"><br>
<textarea name="message">I said the plan is bad, but my boss created it</textarea><br>
<input name="context" value="Meeting" placeholder="Context"><br>
<textarea name="worry">Will he hate me?</textarea><br>
<button>Test</button>
</form>
<div id="result"></div>
<script>
document.getElementById('f').onsubmit=async(e)=>{
e.preventDefault();
const d=new FormData(e.target);
const p=new URLSearchParams();
for(let[k,v]of d)p.append(k,v);
document.getElementById('result').textContent='Loading...';
try{
const r=await fetch('?'+p);
const html=await r.text();
document.getElementById('result').innerHTML=html;
}catch(err){
document.getElementById('result').textContent='Error: '+err.message;
}
}
</script></body></html>`;
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const userMessage = `Who: ${targetPerson}\nSaid: ${message}\nContext: ${context}\nWorry: ${worry}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${effectiveApiKey}`
      },
      body: JSON.stringify({
        model: API_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage }
        ],
        temperature: 1,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(`<div style="color:red;padding:20px;">Error: ${errorText}</div>`, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'No response';

    // Format the response as HTML
    const formattedResponse = aiResponse
      .replace(/## (.*)/g, '<h3 style="color:#22C55E;margin-top:20px;">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    const html = `
<div style="background:#f0fdf4;padding:20px;border-radius:8px;margin-bottom:20px;">
${formattedResponse}
</div>
<div style="color:#666;font-size:12px;margin-top:20px;">
Model: ${API_MODEL} | Tokens: ${data.usage?.total_tokens || 'N/A'}
</div>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });

  } catch (error) {
    return new Response(`<div style="color:red;padding:20px;">Error: ${error}</div>`, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' }
    });
  }
}
