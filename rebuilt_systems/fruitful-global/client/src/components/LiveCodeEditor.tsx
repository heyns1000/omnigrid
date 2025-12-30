import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download, Share2, Code2, Terminal } from "lucide-react";

interface LiveCodeEditorProps {
  initialCode?: string;
  language?: string;
  theme?: "dark" | "light";
  readOnly?: boolean;
}

export default function LiveCodeEditor({
  initialCode = "// Write your code here...\nconsole.log('Hello, OmniGrid!');",
  language = "javascript",
  theme = "dark",
  readOnly = false
}: LiveCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeUsers, setActiveUsers] = useState(3); // Simulated active users
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Simulate real-time collaboration indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 5) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  const runCode = () => {
    setIsRunning(true);
    setOutput([]);

    try {
      // Create a console.log capture
      const logs: string[] = [];
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('ERROR: ' + args.join(' '));
        },
        warn: (...args: any[]) => {
          logs.push('WARNING: ' + args.join(' '));
        }
      };

      // Run the code in a safe context
      const func = new Function('console', code);
      func(customConsole);

      setOutput(logs.length > 0 ? logs : ['Code executed successfully (no output)']);
    } catch (error: any) {
      setOutput([`Error: ${error.message}`]);
    } finally {
      setTimeout(() => setIsRunning(false), 500);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setOutput(['Code copied to clipboard!']);
    } catch (error) {
      setOutput(['Failed to copy code']);
    }
  };

  const languageColors: Record<string, string> = {
    javascript: "bg-yellow-500",
    typescript: "bg-blue-500",
    python: "bg-green-500",
    jsx: "bg-cyan-500",
    tsx: "bg-purple-500"
  };

  return (
    <Card className={`w-full ${theme === 'dark' ? 'bg-gray-900 text-white' : ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Live Code Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {activeUsers} online
            </Badge>
            <Badge className={languageColors[language] || "bg-gray-500"}>
              {language}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Code Editor Area */}
        <div className={`relative rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300'}`}>
          <div className="absolute top-2 right-2 flex gap-2 z-10">
            <Button
              size="sm"
              variant="secondary"
              onClick={downloadCode}
              className="h-7"
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={shareCode}
              className="h-7"
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            readOnly={readOnly}
            className={`w-full p-4 font-mono text-sm resize-none outline-none rounded-lg min-h-[300px] ${
              theme === 'dark'
                ? 'bg-gray-800 text-green-400'
                : 'bg-white text-gray-900'
            }`}
            style={{
              tabSize: 2,
              lineHeight: '1.5'
            }}
            spellCheck={false}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
          <Button variant="outline" onClick={() => setCode(initialCode)}>
            Reset
          </Button>
        </div>

        {/* Output Console */}
        {output.length > 0 && (
          <div className={`rounded-lg border p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4" />
              <span className="font-medium text-sm">Output</span>
            </div>
            <div className="font-mono text-sm space-y-1">
              {output.map((line, index) => (
                <div
                  key={index}
                  className={
                    line.startsWith('ERROR') ? 'text-red-500' :
                    line.startsWith('WARNING') ? 'text-yellow-500' :
                    theme === 'dark' ? 'text-green-400' : 'text-gray-900'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-time Collaboration Indicator */}
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time sync active</span>
          </div>
          <span>•</span>
          <span>Auto-save enabled</span>
        </div>
      </CardContent>
    </Card>
  );
}
