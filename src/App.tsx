import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Editor, { useMonaco } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { saveAs } from "file-saver";

export default function CodeEditorApp() {
  const [code, setCode] = useState<string>(
    "console.log('Welcome to the sandbox')"
  );
  const [output, setOutput] = useState<string>("");
  const [language, setLanguage] = useState<string>("typescript");
  const [editorTheme, setEditorTheme] = useState<string>("vs-light");
  const [terminalColor, setTerminalColor] = useState<string>("bg-white-900");
  const [displayText, setDisplayText] = useState<string>("");
  const fullText = "sandbox-by-shashank";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, []);
  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "markdown" });
      monaco.languages.register({ id: "typescript" });
      monaco.languages.register({ id: "javascript" });
      monaco.languages.setMonarchTokensProvider("markdown", {
        tokenizer: {
          root: [
            [/^#{1,6} .*/, "keyword"],
            [/`[^`]+`/, "string"],
            [/\*\*[^*]+\*\*/, "bold"],
            [/\*[^*]+\*/, "italic"],
            [/\[.*\]\(.*\)/, "link"],
          ],
        },
      });

      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: language !== "javascript",
        noSyntaxValidation: language !== "javascript",
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        moduleResolution:
          monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        noEmit: true,
        strict: language === "typescript",
        noImplicitAny: language === "typescript",
        strictNullChecks: language === "typescript",
        strictFunctionTypes: language === "typescript",
      });
    }
  }, [monaco]);

  useEffect(() => {
    if (language === "markdown") {
      setOutput(code);
    }
  }, [code, language]);

  const runCode = (): void => {
    try {
      if (language === "javascript" || language === "typescript") {
        const consoleLog: string[] = [];
        const customConsole = { log: (msg: string) => consoleLog.push(msg) };
        new Function("console", code)(customConsole);
        setOutput(consoleLog.join("\n"));
      } else if (language === "markdown") {
        setOutput(code);
      } else {
        setOutput("Language execution not supported yet.");
      }
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  };

  const downloadScript = () => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    saveAs(
      blob,
      `script.${
        language === "javascript"
          ? "js"
          : language === "typescript"
          ? "ts"
          : "md"
      }`
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === "s") {
        event.preventDefault();
        runCode();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [code, language]);

  return (
    <div className="flex flex-col w-full h-screen p-4">
      <motion.h1
        className="text-3xl font-mono mb-6 text-center text-blue-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {displayText}
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-500 hover:text-red-700 underline decoration-wavy"
        >
          v0.1;
        </a>
      </motion.h1>

      <div className="flex justify-between mb-4">
        <select
          className="p-2 border rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="typescript">TypeScript</option>
          <option value="javascript">JavaScript</option>
          <option value="markdown">Markdown</option>
        </select>
        <button
          onClick={runCode}
          className="px-4 py-2 bg-black text-white font-semibold rounded hover:bg-blue-600 transition mt-2"
        >
          Run Code
        </button>
        <button
          onClick={downloadScript}
          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
        >
          Download Script
        </button>
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
            options={{ wordWrap: "on" }}
            onChange={(newValue) => setCode(newValue || "")}
          />
        </div>
        <div className={`w-1/2 p-4 overflow-auto ${terminalColor}`}>
          <strong>Output:</strong>
          {language === "markdown" ? (
            <ReactMarkdown>{output}</ReactMarkdown>
          ) : (
            <pre className="whitespace-pre-wrap">{output}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
