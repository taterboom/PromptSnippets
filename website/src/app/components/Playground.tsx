export default function Playground() {
  return (
    <div className="">
      <textarea
        className="text-sm block bg-base-200 text-content-200 border border-neutral-200 rounded w-full py-2 px-3 focus:border-primary-100 focus-visible:outline-none resize-none"
        placeholder={`Type "/" to start`}
        cols={30}
        rows={8}
      ></textarea>
    </div>
  )
}
