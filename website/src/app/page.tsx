import Image from "next/image"
import FeatureCard from "./components/FeatureCard"
import { MdiEmail, MdiGithub } from "./components/icons"
import Playground from "./components/Playground"
import KBD from "./components/KBD"
import Section from "./components/Section"

export default function Home() {
  return (
    <main className="space-y-32">
      <header className="container flex justify-between items-center py-2">
        <div className="flex items-center gap-2 text-lg font-medium">
          <Image src="/logo-128.png" width={48} height={48} alt="logo"></Image>
          PromptSnippets
        </div>
        <div>
          <nav className="flex items-center gap-6">
            <a
              className="text-sm text-content-300/90 hover:text-content-100 transition-colors"
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm text-content-300/90 hover:text-content-100 transition-colors"
              href="#playground"
            >
              Playground
            </a>
            {/* <a className="text-sm text-content-300/90 hover:text-content-100 transition-colors">
              Blog
            </a> */}
            <a
              className="text-sm text-content-300/90 hover:text-content-100 transition-colors"
              href="https://chrome.google.com/webstore/detail/promptsnippets/dkafkdphnlodjiggkpbokmponlkjfaco"
            >
              Download
            </a>
          </nav>
        </div>
      </header>
      <Section className="container text-center">
        <h1 className="text-5xl lead leading-tight font-medium">
          Speed up the input <br />
          with variable snippets
        </h1>
        <p className="text-lg text-content-300 mt-6">
          Whether you{`'`}re coding, blogging, or emailing, <br /> turn repetitive typing into a
          single click with PromptSnippets.
        </p>
        <div className="mt-12 text-center">
          {/* <Button className="inline-block">Add to Chrome</Button> */}
          <a href="https://chrome.google.com/webstore/detail/promptsnippets/dkafkdphnlodjiggkpbokmponlkjfaco">
            <button className="btn">Add to Chrome</button>
          </a>
        </div>
      </Section>
      <Section id="features" className="container !mt-36" delay={0.3}>
        <h2 className="hidden">Features</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <FeatureCard
            title="🧩 Variable Snippets"
            content="PromptSnippets offers the ability to use variable snippets, you can create
              and utilize customized shortcuts for faster and more efficient input on the web."
          />
          <FeatureCard
            title="⚡ Convenient Input"
            content={`Enjoy the convenience of quick input by simply typing "/" followed by the desired snippet, eliminating the need for time-consuming manual input.`}
          />
          <FeatureCard
            title="🔐 No Login Required"
            content={
              <>
                PromptSnippets extension stores your snippets and settings using{" "}
                <a
                  className="underline"
                  href="https://developer.chrome.com/docs/extensions/reference/storage/"
                  target="_blank"
                >
                  Chrome storage
                </a>
                . Data will not be sent to any other place. So you don{"'"}t need to login.
              </>
            }
          />
        </div>
      </Section>
      <Section id="playground" className="container" delay={0.3}>
        <h2 className="text-4xl text-center text-content-100">Playground</h2>
        <p className="mx-auto mt-6 px-4 max-w-[660px] text-center text-content-300">
          You can experience the convenient variable snippets input in the playground. <br />
          Start by typing <KBD>/</KBD> in the input. For the full functionality,{" "}
          <a href="">go to download</a>!
        </p>
        <div className="mx-auto mt-10 px-4 max-w-[780px]">
          <Playground></Playground>
        </div>
      </Section>
      <Section className="container text-center" delay={0.3}>
        <div className="flex justify-center items-center gap-4">
          <Image src="/logo-128.png" width={64} height={64} alt="logo"></Image>
          <h2 className="text-4xl">Ready for get started</h2>
        </div>
        <a href="https://chrome.google.com/webstore/detail/promptsnippets/dkafkdphnlodjiggkpbokmponlkjfaco">
          <button className="btn mt-8">Get started now</button>
        </a>
      </Section>
      <div className="container divide"></div>
      <footer className="container flex justify-between items-center text-content-400 py-6 !mt-0">
        <div className="text-sm">MIT © 2023 PromptSnippets</div>
        <div className="flex items-center gap-4 text-lg">
          <span className="text-sm">Contact</span>
          <a href="mailto:xuebagod@gmail.com">
            <MdiEmail />
          </a>
          <a href="https://github.com/taterboom/PromptSnippets/issues" target="_blank">
            <MdiGithub />
          </a>
        </div>
      </footer>
    </main>
  )
}
