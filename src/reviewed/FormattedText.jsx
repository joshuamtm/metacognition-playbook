/* Lightweight inline-formatter for *italic*, **bold** in question prompts and recommendation
   bodies. Preserves newlines via whitespace-pre-line on the parent. */
export default function FormattedText({ text }) {
  if (!text) return null
  // Match **bold** first (longer), then *italic* — both non-greedy, no nested asterisks.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
