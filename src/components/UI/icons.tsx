import { SVGProps } from "react"

export function MiEnter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
        <path d="M3 14a1 1 0 0 1 1-1h12a3 3 0 0 0 3-3V6a1 1 0 1 1 2 0v4a5 5 0 0 1-5 5H4a1 1 0 0 1-1-1z"></path>
        <path d="M3.293 14.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 1.414L5.414 14l3.293 3.293a1 1 0 1 1-1.414 1.414l-4-4z"></path>
      </g>
    </svg>
  )
}

export function MiArrowDown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 4a1 1 0 0 1 1 1v11.586l4.293-4.293a1 1 0 0 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 1 1 1.414-1.414L11 16.586V5a1 1 0 0 1 1-1z"
      ></path>
    </svg>
  )
}

export function MiArrowUp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 4a1 1 0 0 1 .707.293l6 6a1 1 0 0 1-1.414 1.414L13 7.414V19a1 1 0 1 1-2 0V7.414l-4.293 4.293a1 1 0 0 1-1.414-1.414l6-6A1 1 0 0 1 12 4z"
      ></path>
    </svg>
  )
}

export function MiClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M5.293 5.293a1 1 0 0 1 1.414 0L12 10.586l5.293-5.293a1 1 0 1 1 1.414 1.414L13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L10.586 12L5.293 6.707a1 1 0 0 1 0-1.414z"
      ></path>
    </svg>
  )
}

export function MiAdd(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"
      ></path>
    </svg>
  )
}

export function MiDelete(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
      ></path>
    </svg>
  )
}

export function MiEdit(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l10-10l3-3zM14 7.414l-9 9V19h2.586l9-9L14 7.414zm4 1.172L19.586 7L17 4.414L15.414 6L18 8.586z"
      ></path>
    </svg>
  )
}

export function MiSettings(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 4a1 1 0 0 0-1 1c0 1.692-2.046 2.54-3.243 1.343a1 1 0 1 0-1.414 1.414C7.54 8.954 6.693 11 5 11a1 1 0 1 0 0 2c1.692 0 2.54 2.046 1.343 3.243a1 1 0 0 0 1.414 1.414C8.954 16.46 11 17.307 11 19a1 1 0 1 0 2 0c0-1.692 2.046-2.54 3.243-1.343a1 1 0 1 0 1.414-1.414C16.46 15.046 17.307 13 19 13a1 1 0 1 0 0-2c-1.692 0-2.54-2.046-1.343-3.243a1 1 0 0 0-1.414-1.414C15.046 7.54 13 6.693 13 5a1 1 0 0 0-1-1zm-2.992.777a3 3 0 0 1 5.984 0a3 3 0 0 1 4.23 4.231a3 3 0 0 1 .001 5.984a3 3 0 0 1-4.231 4.23a3 3 0 0 1-5.984 0a3 3 0 0 1-4.231-4.23a3 3 0 0 1 0-5.984a3 3 0 0 1 4.231-4.231z"></path>
        <path d="M12 10a2 2 0 1 0 0 4a2 2 0 0 0 0-4zm-2.828-.828a4 4 0 1 1 5.656 5.656a4 4 0 0 1-5.656-5.656z"></path>
      </g>
    </svg>
  )
}

export function MiRemove(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M4 12a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"></path>
    </svg>
  )
}

export function MiSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M10 4a6 6 0 1 0 0 12a6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"
      ></path>
    </svg>
  )
}

export function MiCircleHelp(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="currentColor">
        <path d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12z"></path>
        <path d="M12 14a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1zm-1.5 2.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0z"></path>
        <path d="M12.39 7.811c-.957-.045-1.76.49-1.904 1.353a1 1 0 0 1-1.972-.328c.356-2.136 2.303-3.102 3.971-3.022c.854.04 1.733.347 2.409.979C15.587 7.44 16 8.368 16 9.5c0 1.291-.508 2.249-1.383 2.832c-.803.535-1.788.668-2.617.668a1 1 0 1 1 0-2c.67 0 1.186-.117 1.508-.332c.25-.167.492-.46.492-1.168c0-.618-.212-1.003-.472-1.246c-.277-.259-.68-.42-1.138-.443z"></path>
      </g>
    </svg>
  )
}

export function TablerMoodEmptyFilled(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M0 0h24v24H0z"></path>
        <path
          fill="currentColor"
          d="M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34zM15 14H9l-.117.007a1 1 0 0 0 0 1.986L9 16h6l.117-.007a1 1 0 0 0 0-1.986L15 14zM9.01 9l-.127.007a1 1 0 0 0 0 1.986L9 11l.127-.007a1 1 0 0 0 0-1.986L9.01 9zm6 0l-.127.007a1 1 0 0 0 0 1.986L15 11l.127-.007a1 1 0 0 0 0-1.986L15.01 9z"
        ></path>
      </g>
    </svg>
  )
}

export function CarbonImportExport(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M55.8 46.1865C55.4686 46.1865 55.2 46.4552 55.2 46.7865V52.4C55.2 52.7314 54.9314 53 54.6 53H9.6C9.26863 53 9 52.7314 9 52.4V46.7865C9 46.4552 8.73137 46.1865 8.4 46.1865H4.6C4.26863 46.1865 4 46.4552 4 46.7865V54.1771C4 54.1812 4.00451 54.1837 4.00798 54.1815V54.1815C4.01147 54.1794 4.01598 54.1819 4.01598 54.186C4.01538 54.7077 4.11696 55.2245 4.315 55.7073C4.51425 56.1929 4.80723 56.6345 5.1772 57.0069C5.54718 57.3793 5.9869 57.6752 6.47124 57.8776C6.95559 58.08 7.47507 58.185 8 58.1865H56C57.0609 58.1865 58.0783 57.7651 58.8284 57.0149C59.5786 56.2648 60 55.2474 60 54.1865V46.7865C60 46.4552 59.7314 46.1865 59.4 46.1865H55.8ZM55.6215 27.808C55.3883 27.5748 55.0105 27.5736 54.7758 27.8053L49.5215 32.9917C49.1424 33.3659 48.5 33.0973 48.5 32.5647V6.78652C48.5 6.45515 48.2314 6.18652 47.9 6.18652H44.1C43.7686 6.18652 43.5 6.45515 43.5 6.78652V32.5647C43.5 33.0973 42.8576 33.3659 42.4785 32.9917L37.2242 27.8053C36.9895 27.5736 36.6117 27.5748 36.3785 27.808L34.4243 29.7623C34.1899 29.9966 34.1899 30.3765 34.4243 30.6108L45.5757 41.7623C45.8101 41.9966 46.1899 41.9966 46.4243 41.7623L57.5757 30.6108C57.8101 30.3765 57.8101 29.9966 57.5757 29.7623L55.6215 27.808ZM18.4243 6.61079C18.1899 6.37647 17.8101 6.37647 17.5757 6.61079L6.42426 17.7623C6.18995 17.9966 6.18995 18.3765 6.42426 18.6108L8.37319 20.5597C8.6085 20.795 8.99035 20.7939 9.22425 20.5572L14.4732 15.2451C14.8501 14.8637 15.5 15.1306 15.5 15.6669V42.4C15.5 42.7314 15.7686 43 16.1 43H19.9C20.2314 43 20.5 42.7314 20.5 42.4V15.6669C20.5 15.1306 21.1499 14.8637 21.5268 15.2451L26.7758 20.5572C27.0096 20.7939 27.3915 20.795 27.6268 20.5597L29.5757 18.6108C29.8101 18.3765 29.8101 17.9966 29.5757 17.7623L18.4243 6.61079Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function TablerPower(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 6a7.75 7.75 0 1 0 10 0m-5-2v8"
      ></path>
    </svg>
  )
}
