import Image from "next/image"

export default {
  logo: (
    <div
      className="flex items-center gap-2 text-lg font-medium"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        fontSize: "1.125rem",
        fontWeight: "500",
        lineHeight: "1.75rem",
      }}
    >
      <Image src="/logo-128.png" width={48} height={48} alt="logo"></Image>
      PromptSnippets
    </div>
  ),
  project: {
    link: "https://github.com/taterboom/PromptSnippets",
  },
  footer: { text: `MIT ${new Date().getFullYear()} © PromptSnippets` },
  // ... other theme options
}
