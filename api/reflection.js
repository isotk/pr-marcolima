module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "OPENAI_API_KEY not configured" });
  }

  const { reference, scripture, context, theme } = req.body || {};
  if (!reference || !scripture) {
    return res.status(400).json({ error: "Missing reference or scripture" });
  }

  const prompt = `
Crie uma reflexão devocional evangélica em português do Brasil.

Regras:
- Seja bíblico, pastoral e profundo, sem frases genéricas.
- Use o contexto imediato do texto para explicar a aplicação.
- Não invente fatos históricos específicos se não estiverem no contexto fornecido.
- Escreva em 1 parágrafo de 110 a 160 palavras.
- Tom pastoral, claro, cristocêntrico e prático.
- Não inclua título, lista, saudação ou oração.

Tema: ${theme || "Palavra"}
Referência: ${reference}
Texto bíblico: ${scripture}
Contexto imediato: ${context || "Não informado"}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente pastoral evangélico, fiel ao texto bíblico e cuidadoso com aplicação devocional."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 360
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "AI request failed" });
    }

    const reflection = data.choices?.[0]?.message?.content?.trim();
    if (!reflection) {
      return res.status(502).json({ error: "Empty AI response" });
    }

    return res.status(200).json({ reflection });
  } catch (error) {
    return res.status(500).json({ error: "Reflection generation failed" });
  }
};
