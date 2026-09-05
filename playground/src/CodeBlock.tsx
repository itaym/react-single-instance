const TOKEN_RE =
  /(\/\/[^\n]*)|('[^'\n]*'|"[^"\n]*")|(<\/?[A-Za-z][\w.-]*|\/>|<\/?>)|(\b(?:import|from|export|default|const|let|function|return|new)\b)/g;

function highlightLine(line: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > lastIndex) nodes.push(line.slice(lastIndex, match.index));
    const [full, comment, string, tag, keyword] = match;
    const className = comment ? 'tok-comment' : string ? 'tok-string' : tag ? 'tok-tag' : keyword ? 'tok-keyword' : '';
    nodes.push(
      <span key={`${keyPrefix}-${i++}`} className={className}>
        {full}
      </span>,
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  return nodes;
}

export function CodeBlock({ code }: { code: string }) {
  const lines = code.replace(/^\n/, '').split('\n');
  return (
    <pre className="code-block">
      <code>
        {lines.map((line, idx) => (
          <div key={idx} className="code-line">
            {highlightLine(line, String(idx))}
          </div>
        ))}
      </code>
    </pre>
  );
}
