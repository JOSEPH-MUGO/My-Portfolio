require("dotenv").config();
const express             = require("express");
const { WebSocketServer } = require("ws");
const app  = express();
const port = process.env.PORT || 10000;
const API  = process.env.BACKEND_API_URL;
const KEY  = process.env.OPENROUTER_API_KEY;

if (!API || !KEY) {
  console.error("Missing required .env config");
  process.exit(1);
}

const COMMANDS = {
  about:          "A brief summary of my biography.",
  skills:         "My technical skills and proficiency levels.",
  projects:       "Projects I have worked on.",
  experience:     "Experience I have gained and roles I have played.",
  education:      "Degrees and institutions.",
  certifications: "Certifications I've earned.",
  testimonials:   "What people say about my work.",
  services:       "Services I offer as a freelance developer.",
  contact:        "How to get in touch for inquiries.",
  help:           "List available commands.",
  exit:           "Close the CLI session.",
};

function formatRows(dataArray) {
  return dataArray
    .map(item =>
      Object.entries(item)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join("\n")
    )
    .join("\n\n");
}

function buildPrompt(cmd, bulletText) {
  return `
You are Joseph Mugo’s AI-powered CLI assistant.
User asked for "${cmd}".
Here is the relevant portfolio data:

${bulletText}

Please write a concise, engaging, first-person summary (about 5–6 lines), professional tone with time-based greetings.
`.trim();
}

app.get("/", (_req, res) => res.send("CLI Backend is live!"));

const server = app.listen(port, () =>
  console.log(`CLI backend running on port ${port}`)
);
const wss = new WebSocketServer({ server, path: "/ws" });

wss.on("connection", ws => {
  ws.on("message", async raw => {
    const cmd = raw.toString().trim().toLowerCase();
    let responseText;

    if (!cmd) {
      responseText = "\u001b[31mPlease enter a valid command\u001b[0m";
    }
    else if (cmd === "help" || cmd === "joseph") {
      const lines = ["\u001b[1;32mAvailable Commands\u001b[0m"];
      for (let [k,d] of Object.entries(COMMANDS)) {
        lines.push(`\u001b[38;5;45m• ${k.padEnd(12)}\u001b[0m - ${d}`);
      }
      responseText = lines.join("\n");
    }
    else if (cmd === "contact") {
      responseText =
        "\u001b[3m Hello! Feel free to reach out anytime either through\u001b[0m" +
        "\u001b[1;32mEmail:\u001b[0m josephithanwa@gmail.com\n" +
        "\u001b[1;32mPhone:\u001b[0m 0740381240\n" +
        "\u001b[1;32mLinkedIn:\u001b[0m https://www.linkedin.com/in/josephmugoithanwa/\n";
        
    }
    else if (cmd === "exit") {
      responseText = "\u001b[1;32mThanks for exploring my AI-powered portfolio. Goodbye!\u001b[0m";
    }
    else if (!COMMANDS[cmd]) {
      responseText = `\u001b[31mUnknown command "${cmd}". Type "help" to see available commands.\u001b[0m`;
    }
    else {
      // AI-backed commands
      try {
        const apiRes = await fetch(`${API}/api/${cmd}`);
        if (!apiRes.ok) throw new Error(`Portfolio API returned ${apiRes.status}`);
        let data = await apiRes.json();
        data = Array.isArray(data) ? data : data ? [data] : [];
        if (!data.length) throw new Error(`No data found for "${cmd}"`);

        const bullets  = formatRows(data);
        const aiPrompt = buildPrompt(cmd, bullets);

        const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type":  "application/json",
            "Authorization": `Bearer ${KEY}`,
            "HTTP-Referer":  "https://joseph-mugo.onrender.com/",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [
              { role: "system", content: "You are Joseph Mugo's portfolio assistant." },
              { role: "user",   content: aiPrompt }
            ],
          }),
        });
        if (!aiRes.ok) throw new Error(`AI returned ${aiRes.status}`);

        const aiJson = await aiRes.json();
        const choices = aiJson.choices;
        if (!choices || !choices[0] || !choices[0].message) {
          responseText = "\u001b[31m No response from AI.\u001b[0m";
        } else {
          responseText = choices[0].message.content.trim();
        }
      } catch (err) {
        console.error(`Error handling "${cmd}":`, err);
        responseText = `\u001b[31m${err.message}\u001b[0m`;
      }
    }

    // JSON envelope
    ws.send(JSON.stringify({ type: "data", payload: "\n" + responseText }));
    ws.send(JSON.stringify({ type: "end" }));
    if (cmd === "exit") setTimeout(() => ws.close(), 100);
  });
});
