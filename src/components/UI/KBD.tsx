import clsx from "classnames"

export default function KBD(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
) {
  return (
    <span
      {...props}
      className={clsx("inline-flex items-center rounded h-6 px-2 bg-neutral-200", props.className)}
    >
      {props.children}
    </span>
  )
}
