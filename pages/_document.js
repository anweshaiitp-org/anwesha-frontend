// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Official cultural fest of IIT Patna - Anwesha 2026" />

        <meta property="og:title" content="Anwesha 2026 | IIT Patna" />
        <meta property="og:description" content="Official cultural fest of IIT Patna - Anwesha 2026" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anwesha.iitp.ac.in" />

        <meta name="twitter:title" content="Anwesha 2026 | IIT Patna" />
        <meta name="twitter:description" content="Official cultural fest of IIT Patna - Anwesha 2026" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
