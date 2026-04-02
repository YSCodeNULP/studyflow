import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return NextResponse.json(
      { error: 'Не задано GEMINI_API_KEY у змінних середовища.' },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return NextResponse.json({ error: 'Порожній запит.' }, { status: 400 });
  }

  const finalPrompt = [
    'Ти – навчальний помічник для студента українського університету.',
    'Склади практичний план підготовки українською мовою.',
    'Формат відповіді:',
    '1) Коротка ціль.',
    '2) План по кроках.',
    '3) Розподіл на навчальні сесії.',
    '4) На що звернути особливу увагу.',
    '5) Маленький чекліст готовності.',
    '',
    `Запит студента: ${prompt}`
  ].join('\n');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: finalPrompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: data?.error?.message || 'Помилка Gemini API.' },
      { status: response.status }
    );
  }

  const result =
    data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('\n')
      .trim() || 'Не вдалося отримати текстову відповідь.';

  return NextResponse.json({ result });
}
