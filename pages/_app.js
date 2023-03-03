import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (<>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2664464705731815"
      crossoOrigin="anonymous"></script>
    <Component {...pageProps} />
  </>)
}

export default MyApp