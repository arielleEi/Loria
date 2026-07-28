"use client";

interface Props {
  content: string;
}

export default function MarkdownResult({ content }: Props) {
  // Simple markdown renderer
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];

  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} style={{ margin: "0.5rem 0 0.75rem 1.2rem" }}>
          {listItems.map((item, i) => (
            <li
              key={i}
              style={{
                marginBottom: "0.3rem",
                lineHeight: 1.6,
                color: "var(--text)",
                fontSize: "0.95rem",
              }}
            >
              {renderInline(item.replace(/^[-*•]\s*/, ""))}
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    // Bold
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(String(idx));
      return;
    }

    if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
      flushList(String(idx));
      const text = trimmed.replace(/^#{2,3}\s*/, "");
      elements.push(
        <h2
          key={idx}
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--text)",
            margin: "1.25rem 0 0.6rem",
            paddingBottom: "0.3rem",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {text}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(String(idx));
      const text = trimmed.replace(/^#\s*/, "");
      elements.push(
        <h1
          key={idx}
          style={{
            fontSize: "1.2rem",
            fontWeight: 800,
            color: "var(--text)",
            margin: "0.5rem 0 0.75rem",
          }}
        >
          {text}
        </h1>
      );
      return;
    }

    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      listItems.push(trimmed);
      return;
    }

    flushList(String(idx));
    elements.push(
      <p
        key={idx}
        style={{
          marginBottom: "0.75rem",
          lineHeight: 1.7,
          color: "var(--text)",
          fontSize: "0.95rem",
        }}
      >
        {renderInline(trimmed)}
      </p>
    );
  });

  flushList("end");

  return (
    <div
      style={{
        background: "var(--bg-secondary)",
        borderRadius: "12px",
        padding: "1.5rem",
        lineHeight: 1.7,
      }}
    >
      {elements}
    </div>
  );
}
