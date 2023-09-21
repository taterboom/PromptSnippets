import { default as NextImage, ImageProps } from "next/image"

export function Image(props: { s?: string; src?: string; type?: string } & ImageProps) {
  return (
    <NextImage
      {...props}
      src={props.s ? `/assets/docs/${props.s}.${props.type ?? "png"}` : props.src}
    ></NextImage>
  )
}

export function Video(props: { s?: string; src?: string; type?: string }) {
  return (
    <video style={{ maxWidth: 800 }} controls>
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
        opacity: 0.85,
        ...props.style,
      }}
    ></span>
  )
}
