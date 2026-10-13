// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Official cultural fest of IIT Patna - Anwesha 2027" />

        <meta property="og:title" content="Anwesha 2027 | IIT Patna" />
        <meta property="og:description" content="Official cultural fest of IIT Patna - Anwesha 2027" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anwesha.iitp.ac.in" />

        <meta name="twitter:title" content="Anwesha 2027 | IIT Patna" />
        <meta name="twitter:description" content="Official cultural fest of IIT Patna - Anwesha 2027" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&family=Laila:wght@300;400;500;600;700&family=Lisu+Bosa:ital,wght@0,400;0,600;0,700;1,400&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
