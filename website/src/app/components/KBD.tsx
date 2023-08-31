import clsx from "classnames"

export default function KBD(
  props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
) {
  return (
    <span
      {...props}
      className={clsx(
        "inline-flex items-center rounded h-4 px-[3px] text-xs bg-neutral-200",
        props.className
      )}
    >
      {props.children}
    </span>
  )
}
