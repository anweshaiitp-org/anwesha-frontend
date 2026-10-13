// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://anwesha.iitp.ac.in/#website",
        "url": "https://anwesha.iitp.ac.in",
        "name": "Anwesha 2027 | IIT Patna",
        "description": "Annual Cultural Festival of Indian Institute of Technology Patna",
        "publisher": {
          "@id": "https://anwesha.iitp.ac.in/#organization"
        }
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://anwesha.iitp.ac.in/#organization",
        "name": "IIT Patna",
        "url": "https://www.iitp.ac.in",
        "logo": "https://anwesha.iitp.ac.in/home/logo.png"
      },
      {
        "@type": "Festival",
        "@id": "https://anwesha.iitp.ac.in/#festival",
        "name": "Anwesha 2027",
        "description": "The annual socio-cultural festival of IIT Patna featuring pronites, celebrity performances, cultural competitions, workshops, and exhibitions.",
        "url": "https://anwesha.iitp.ac.in",
        "startDate": "2027-02-06",
        "endDate": "2027-02-08",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "Indian Institute of Technology Patna",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Bihta",
            "addressLocality": "Patna",
            "addressRegion": "Bihar",
            "postalCode": "801106",
            "addressCountry": "IN"
          }
        }
      }
    ]
  }

  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Official cultural fest of IIT Patna - Anwesha 2027. East India's premier annual cultural extravaganza featuring Pronites, star concerts, cultural competitions, workshops, and exhibitions." />
        <meta name="keywords" content="Anwesha, Anwesha 2027, IIT Patna, Cultural Fest, IITP Anwesha, Pronite, Fest Passes, Competitions, Workshops, College Festival, Bihar, East India Fest, Anwesha IITP" />
        <meta name="author" content="Anwesha IIT Patna" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        <link rel="canonical" href="https://anwesha.iitp.ac.in" />

        {/* Open Graph Meta Tags */}
        <meta property="og:site_name" content="Anwesha 2027 | IIT Patna" />
        <meta property="og:title" content="Anwesha 2027 | IIT Patna - Annual Socio-Cultural Festival" />
        <meta property="og:description" content="Official cultural fest of IIT Patna - Anwesha 2027. East India's premier annual cultural extravaganza featuring Pronites, star concerts, cultural competitions, and workshops." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://anwesha.iitp.ac.in" />
        <meta property="og:image" content="https://anwesha.iitp.ac.in/home/logo.png" />
        <meta property="og:image:alt" content="Anwesha IIT Patna Logo" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@anweshaiitp" />
        <meta name="twitter:creator" content="@anweshaiitp" />
        <meta name="twitter:title" content="Anwesha 2027 | IIT Patna - Annual Socio-Cultural Festival" />
        <meta name="twitter:description" content="Official cultural fest of IIT Patna - Anwesha 2027. East India's premier annual cultural extravaganza." />
        <meta name="twitter:image" content="https://anwesha.iitp.ac.in/home/logo.png" />

        {/* Structured Data (JSON-LD) for Search Engine Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
