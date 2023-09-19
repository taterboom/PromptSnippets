export default function YtbVideo(props: { src: string }) {
  return (
    <iframe
      style={{
        display: "block",
        width: 800,
        height: 520,
      }}
      src={props.src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  )
}
