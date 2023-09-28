import clsx from "classnames"

export default function Tags(props: { tags?: string[]; selectedTags?: string[] }) {
  return props.tags ? (
    <div className="inline-block">
      {props.tags.map((tag, index) => (
        <span
          key={index}
          className={clsx(
            "inline-flex items-center align-[0.2em] px-1 h-[14px] border border-neutral-200 text-content-300 rounded text-[8px] mx-0.5 opacity-80",
            props.selectedTags?.includes(tag) &&
              "!bg-primary-200 !text-primary-content-200 !border-primary-200 opacity-95",
            index === 0 && "!ml-0"
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  ) : null
}
