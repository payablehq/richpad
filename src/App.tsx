import { useState, useRef, useCallback } from "react";
import { RichPad } from "./components/RichPad";
import type { RichPadRef, ThemeMode } from "./core/types";
import {
  Sun,
  Moon,
  Code2,
  FileJson,
  FileText,
  Type,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import "./App.css";

// ─── Sample Content ──────────────────────────────────────────────────────────

const SAMPLE_CONTENT = `
<h1>Welcome to RichPad</h1>
<p>A modern, enterprise-grade rich text editor built for professional teams. Designed to match the editing experience of <strong>Jira</strong>, <strong>Confluence</strong>, <strong>Linear</strong>, and <strong>GitHub</strong>.</p>

<h2>✨ Features</h2>
<ul>
  <li><strong>Rich text formatting</strong> — Bold, italic, underline, strikethrough, code, and highlight</li>
  <li><strong>Block types</strong> — Headings, paragraphs, blockquotes, code blocks</li>
  <li><strong>Lists</strong> — Bullet, numbered, and task lists with nesting</li>
  <li><strong>Tables</strong> — Full table support with resizable columns</li>
  <li><strong>Links</strong> — Inline hyperlinks with auto-detection</li>
  <li><strong>Images</strong> — Insert from URL with responsive display</li>
</ul>

<h2>📋 Task List</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><p>Set up Tiptap with React</p></li>
  <li data-type="taskItem" data-checked="true"><p>Build enterprise toolbar</p></li>
  <li data-type="taskItem" data-checked="true"><p>Add dark mode support</p></li>
  <li data-type="taskItem" data-checked="false"><p>Integrate with your product</p></li>
</ul>

<h2>💻 Code Support</h2>
<p>Inline code like <code>const editor = useEditor()</code> and full code blocks:</p>
<pre><code class="language-typescript">import { RichPad } from 'richpad';

function App() {
  return (
    &lt;RichPad
      placeholder="Start writing..."
      theme={{ mode: 'light' }}
      onChange={(content) =&gt; console.log(content)}
    /&gt;
  );
}</code></pre>

<h2>💬 Blockquote</h2>
<blockquote><p>The editor should feel like a mature platform component used daily by professional teams — clean, fast, and predictable.</p></blockquote>

<hr>
<p>Try editing this content, using keyboard shortcuts (<strong>⌘+B</strong> for bold, <strong>⌘+I</strong> for italic), or the slash command menu by typing <code>/</code> at the start of a line.</p>
`;

// ─── Output Format Tabs ──────────────────────────────────────────────────────

type OutputTab = "html" | "json" | "markdown" | "text";

const OUTPUT_TABS: { id: OutputTab; label: string; icon: React.ReactNode }[] = [
  { id: "html", label: "HTML", icon: <Code2 size={14} /> },
  { id: "json", label: "JSON", icon: <FileJson size={14} /> },
  { id: "markdown", label: "Markdown", icon: <FileText size={14} /> },
  { id: "text", label: "Text", icon: <Type size={14} /> },
];

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [activeTab, setActiveTab] = useState<OutputTab>("html");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<RichPadRef>(null);

  const isDark = theme === "dark";

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const updateOutput = useCallback(() => {
    if (!editorRef.current) return;
    switch (activeTab) {
      case "html":
        setOutput(editorRef.current.getHTML());
        break;
      case "json":
        setOutput(JSON.stringify(editorRef.current.getJSON(), null, 2));
        break;
      case "markdown":
        setOutput(editorRef.current.getMarkdown());
        break;
      case "text":
        setOutput(editorRef.current.getText());
        break;
    }
  }, [activeTab]);

  const handleTabChange = useCallback((tab: OutputTab) => {
    setActiveTab(tab);
    // Delay to allow state update
    setTimeout(() => {
      if (!editorRef.current) return;
      switch (tab) {
        case "html":
          setOutput(editorRef.current.getHTML());
          break;
        case "json":
          setOutput(JSON.stringify(editorRef.current.getJSON(), null, 2));
          break;
        case "markdown":
          setOutput(editorRef.current.getMarkdown());
          break;
        case "text":
          setOutput(editorRef.current.getText());
          break;
      }
    }, 0);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [output]);

  const handleReset = useCallback(() => {
    editorRef.current?.setContent(SAMPLE_CONTENT);
    updateOutput();
  }, [updateOutput]);

  return (
    <div className={`app ${isDark ? "app--dark" : "app--light"}`}>
      <header className="app-header">
        <div className="app-header__left">
          <div className="app-logo">
            <div className="app-logo__icon">RP</div>
            <div className="app-logo__text">
              <span className="app-logo__name">RichPad</span>
              <span className="app-logo__tag">Enterprise Editor</span>
            </div>
          </div>
        </div>
        <div className="app-header__right">
          <button
            className="app-theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="app-content">
          {/* Example 1: Full Editor */}
          <section className="app-section">
            <div className="app-section__header">
              <h2 className="app-section__title">1. Full Editor</h2>
              <div className="app-section__actions">
                <button
                  className="app-btn app-btn--ghost"
                  onClick={handleReset}
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            <div className="app-editor-container">
              <RichPad
                ref={editorRef}
                content={SAMPLE_CONTENT}
                placeholder="Type '/' for commands..."
                theme={{ mode: theme }}
                toolbarVariant="modern"
                onChange={() => updateOutput()}
                minHeight={300}
                maxHeight={600}
                ariaLabel="Full demo editor"
              />
            </div>
          </section>

          {/* Output for Full Editor */}
          <section className="app-section">
            <div className="app-section__header">
              <h2 className="app-section__title">Output (Full Editor)</h2>
              <div className="app-section__actions">
                <div className="app-tabs">
                  {OUTPUT_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      className={`app-tab ${activeTab === tab.id ? "app-tab--active" : ""}`}
                      onClick={() => handleTabChange(tab.id)}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  className="app-btn app-btn--ghost"
                  onClick={handleCopy}
                  disabled={!output}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
            <div className="app-output">
              <pre className="app-output__code">
                <code>
                  {output || "Edit the content above to see output here..."}
                </code>
              </pre>
            </div>
          </section>

          {/* Example 2: Simple Editor */}
          <section className="app-section">
            <div className="app-section__header">
              <h2 className="app-section__title">2. Simple Editor</h2>
            </div>
            <div className="app-editor-container" style={{ padding: "16px" }}>
              <RichPad
                content=""
                placeholder="Just start typing. No toolbar, purely distraction free..."
                theme={{ mode: theme }}
                toolbar={false}
                minHeight={150}
              />
            </div>
          </section>

          {/* Example 3: Slash Commands Example */}
          <section className="app-section">
            <div className="app-section__header">
              <h2 className="app-section__title">
                3. Editor with Slash Commands
              </h2>
            </div>
            <div className="app-editor-container">
              <RichPad
                content="<p>Try typing <code>/</code> at the start of a new line to trigger the slash menu (Not fully wired in demo, but UI is ready!)</p>"
                placeholder="Type '/' for commands..."
                theme={{ mode: theme }}
                minHeight={150}
              />
            </div>
          </section>

          {/* Example 4: Tag/Mention Example */}
          <section className="app-section">
            <div className="app-section__header">
              <h2 className="app-section__title">
                4. Editor with Tag/Mention Examples
              </h2>
            </div>
            <div className="app-editor-container">
              <RichPad
                content="<p>Mention users by typing <code>@</code> followed by their name like <span data-type='mention' class='mention' data-id='1'>@Alice</span> or <span data-type='mention' class='mention' data-id='2'>@Bob</span>.</p>"
                theme={{ mode: theme }}
                minHeight={150}
              />
            </div>
          </section>

          {/* Example 5: Comments Template */}
          <section className="app-section">
            <div className="app-section__header">
              <h2 className="app-section__title">5. Comments Template</h2>
            </div>
            <div
              style={{
                padding: "16px",
                background: isDark ? "#1d2125" : "#ffffff",
              }}
            >
              <div
                style={{
                  border: "1px solid var(--app-border)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <RichPad
                  content=""
                  placeholder="Add a comment..."
                  theme={{ mode: theme }}
                  toolbarVariant="bottom"
                  minHeight={80}
                  ariaLabel="Comment editor"
                />
              </div>

              {/* Action row */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                <button
                  className="app-btn app-btn--ghost"
                  style={{ padding: "6px 14px" }}
                >
                  Cancel
                </button>
                <button
                  className="app-btn"
                  style={{
                    background: "var(--app-accent)",
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: "4px",
                    fontWeight: 500,
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
