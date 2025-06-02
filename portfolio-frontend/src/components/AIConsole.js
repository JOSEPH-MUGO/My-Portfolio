import React, { useEffect, useRef } from "react";
import { Terminal }            from "@xterm/xterm";
import { FitAddon }            from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import "../styles/AIConsole.css";
import heroImage               from "../assets/mypic2.jpeg";

const WS_URL = process.env.REACT_APP_CLI_WS_URL;

export default function AIConsole() {
  const containerRef = useRef(null);
  const fitAddonRef = useRef(new FitAddon());
  const termRef     = useRef(null);
  const inputRef    = useRef("");   // user‐typed command
  const queueRef    = useRef([]);   // incoming JSON messages
  const busyRef     = useRef(false);

  // prompt helper
  const prompt = () => {
    termRef.current.write(
      "\r\n\u001b[1;97mjosephmugo\u001b[0m" +
      "\u001b[38;5;45m@portfolio\u001b[0m" +
      "\u001b[1;32m:~$ \u001b[0m"
    );
  };

  useEffect(() => {
    // 1) Initialize terminal
    const term = new Terminal({
      cursorBlink: true,
      convertEol:   true,
      scrollback:  1000,
      fontFamily:  "MesloLGS NF, monospace",
      fontSize:    14,
      theme: {
        background: "#000000",
        foreground: "#00ff00",
        cursor:     "#00ff00",
      }
    });
    term.loadAddon(fitAddonRef.current);
    term.open(containerRef.current);
    fitAddonRef.current.fit();
    termRef.current = term;

    // 2) Typing effect helper
    const typeText = async (text, speed = 20) => {
      // Build ANSI‐escape regex dynamically
      const ESC = String.fromCharCode(27);
      const ansiRegex = new RegExp(`(${ESC}\\[[\\d;]*[A-Za-z])`, "g");

      const parts = text.split(ansiRegex);
      for (const part of parts) {
        if (!part) continue;
        if (ansiRegex.test(part)) {
          term.write(part);
        } else {
          for (const ch of part) {
            term.write(ch);
            await new Promise(r => setTimeout(r, speed));
          }
        }
      }
    };

    // 3) Queue processor
    const processQueue = async () => {
      if (busyRef.current) return;
      busyRef.current = true;
      while (queueRef.current.length) {
        const msg = queueRef.current.shift();
        if (msg.type === "data") {
          await typeText(msg.payload.replace(/\n/g, "\r\n"), 20);
        } else if (msg.type === "end") {
          prompt();
        }
      }
      busyRef.current = false;
    };

    // 4) Print intro and first prompt
    (async () => {
      term.write("\r\n");
      await typeText("\u001b[38;5;46mWelcome to my AI-Powered Portfolio Command Line Interface!\u001b[0m\r\n");
      await typeText("\u001b[38;5;46mTo Proceed\u001b[0m\r\n");
      await typeText(
        "\u001b[38;5;46mType \u001b[1;37mjoseph\u001b[0m" +
        "\u001b[38;5;46m or \u001b[1;37mhelp\u001b[0m" +
        "\u001b[38;5;46m to see commands.\u001b[0m"
      );
      prompt();
    })();

    // 5) WebSocket setup
    const ws = new WebSocket(`${WS_URL}/ws`);
    ws.onerror = () => {
      term.write("\r\n\u001b[31m[Error] Backend unreachable.\u001b[0m\r\n");
      prompt();
    };
    ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data);
        queueRef.current.push(msg);
        processQueue();
      } catch {
        // ignore non-JSON
      }
    };

    // 6) User input handler
    term.onData(key => {
      if (key === "\r") {
        term.write("\r\n");
        ws.send(inputRef.current.trim());
        inputRef.current = "";
      } else if (key.charCodeAt(0) === 127) {
        if (inputRef.current.length) {
          term.write("\b \b");
          inputRef.current = inputRef.current.slice(0, -1);
        }
      } else if (key >= " " && key <= "~") {
        term.write(key);
        inputRef.current += key;
      }
    });

    // 7) Refit on window resize
    const onResize = () => fitAddonRef.current.fit();
    window.addEventListener("resize", onResize);

    // cleanup
    return () => {
      ws.close();
      term.dispose();
      window.removeEventListener("resize", onResize);
    };
  }, []); // no missing dependencies now

  return (
    <div className="ai-cli-wrapper">
      <div className="cli-left">
        <div className="name-plate">JOSEPH MUGO</div>
        <p className="namep">Software Developer || Data Analytics</p>
        <div className="card-3d">
          <img src={heroImage} alt="Joseph Mugo" className="profile-photo" />
        </div>
      </div>
      <div className="cli-right">
        <div className="terminal-glow">
          <div ref={containerRef} className="terminal-container" />
        </div>
      </div>
    </div>
  );
}
