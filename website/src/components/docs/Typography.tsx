export function Text2(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
) {
  return (
    <span
      {...props}
      style={{
        display: "inline-block",
        fontSize: "0.875rem",
        lineHeight: "1.5rem",
        marginTop: "0.5rem",
        opacity: 0.85,
        ...props.style,
      }}
    ></span>
  )
}
