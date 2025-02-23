import React, { useState } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditorApp() {
  const [code, setCode] = useState<string>("console.log('Hello, World!')");
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [editorTheme, setEditorTheme] = useState<string>("vs-light");
  const [terminalColor, setTerminalColor] = useState<string>("bg-white-900");

  const runCode = (): void => {
    try {
      if (language === "javascript") {
        const consoleLog: string[] = [];
        const customConsole = { log: (msg: string) => consoleLog.push(msg) };
        new Function("console", code)(customConsole);
        setOutput(consoleLog.join("\n"));
      } else {
        setOutput("Language execution not supported yet.");
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-500">
        Sandbox v0.1 by{" "}
        <a
          href="https://www.linkedin.com/in/thatshashanguy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-700 underline decoration-wavy"
        >
          Shashank
        </a>
      </h1>
      <div className="flex justify-between mb-4">
        <select
          className="p-2 border rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
        </select>
        <select
          className="p-2 border rounded"
          value={editorTheme}
          onChange={(e) => setEditorTheme(e.target.value)}
        >
          <option value="light">Light</option>
          <option value="vs-dark">Dark</option>
          <option value="hc-black">High Contrast</option>
        </select>
        <select
          className="p-2 border rounded"
          value={terminalColor}
          onChange={(e) => setTerminalColor(e.target.value)}
        >
          <option value="bg-white text-black">White</option>
          <option value="bg-gray-900 text-white">Dark Gray</option>
          <option value="bg-black text-white">Black</option>
        </select>
      </div>
      <div className="flex w-full h-full border rounded-lg overflow-hidden">
        <div className="w-1/2 border-r flex flex-col">
          <Editor
            height="100%"
            theme={editorTheme}
            defaultLanguage={language}
            value={code}
            onChange={(newValue) => setCode(newValue || "")}
          />
          <button
            onClick={runCode}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition mt-2"
          >
            Run Code
          </button>
        </div>
        <div className={`w-1/2 p-4 overflow-auto ${terminalColor}`}>
          <strong>Output:</strong>
          <pre className="whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
