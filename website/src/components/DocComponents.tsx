import { default as NextImage, ImageProps } from "next/image"

export function Image(props: { s?: string; src?: string; type?: string } & ImageProps) {
  return (
    <NextImage
      {...props}
      src={props.s ? `/assets/docs/${props.s}.${props.type ?? "png"}` : props.src}
    ></NextImage>
  )
}

export function Video(props: { s?: string; src?: string; type?: string; autoplay?: boolean }) {
  return (
    <video style={{ maxWidth: 800 }} controls autoPlay={props.autoplay} loop={props.autoplay}>
      <source
        src={props.s ? `/assets/docs/${props.s}.mp4` : props.src}
        type={props.s ? "video/mp4" : props.type}
      ></source>
    </video>
  )
}

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
        marginBottom: "0.25rem",
        opacity: 0.85,
        ...props.style,
      }}
    ></span>
  )
}

export function Space(props: { size?: "normal" | "small" | "large" }) {
  const size = props.size ?? "normal"
  const h = size === "normal" ? "0.5rem" : size === "small" ? "0.25rem" : "1rem"
  return <div style={{ height: h }}></div>
}
