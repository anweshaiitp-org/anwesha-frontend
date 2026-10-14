"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import styles from "./Footer.module.css";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/anwesha_iitpatna/", Icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/anwesha.iitpatna/", Icon: FaFacebookF },
  { label: "X (Twitter)", href: "https://twitter.com/anweshaiitpat/", Icon: FaXTwitter },
  { label: "YouTube", href: "https://www.youtube.com/@AnweshaIITP", Icon: FaYoutube },
];

const linkGroups = [
  {
    title: "Explore",
    links: [
      { label: "Events", href: "/events" },
      { label: "Multicity", href: "/all-multicity" },
      { label: "Gallery", href: "/gallery" },
      { label: "Get Passes", href: "/anweshapass" },
    ],
  },
  {
    title: "Fest",
    links: [
      { label: "About Us", href: "/aboutus" },
      { label: "Our Team", href: "/ourteam" },
      { label: "Sponsors", href: "/oursponsors" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const Footer = () => {
  const isCA_page = usePathname() === "/campus-ambassador";

  return (
    <footer className={clsx(styles.footer, isCA_page && "w-[100vw]")}>
      <div className={styles.flower} aria-hidden="true">
        <Image src="/footer/flower.svg" alt="" width={180} height={120} />
      </div>

      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" aria-label="Anwesha home">
              <Image src="/navbar/logo.svg" alt="Anwesha logo" width={200} height={72} />
            </Link>
            <p className={styles.tagline}>The annual techno-cultural fest of IIT Patna.</p>
            <ul className={styles.socials}>
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {linkGroups.map((group) => (
            <nav key={group.title} className={styles.column} aria-label={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className={styles.column}>
            <h3>Reach us</h3>
            <ul className={styles.contact}>
              <li>
                <MapPin size={18} aria-hidden="true" />
                <span>
                  Anwesha Office, IIT Patna,
                  <br />
                  Bihta, Patna - 801106
                </span>
              </li>
              <li>
                <Phone size={18} aria-hidden="true" />
                <span>
                  Technical: <a href="tel:+918789445978">+91 87894 45978</a>
                  <br />
                  Payments: <a href="tel:+918467989069">+91 84679 89069</a>
                </span>
              </li>
              <li>
                <Mail size={18} aria-hidden="true" />
                <a href="mailto:anwesha@iitp.ac.in">anwesha@iitp.ac.in</a>
              </li>
            </ul>
          </div>
        </div>

        <p className={styles.note}>
          Site not loading properly? Clear the site data or try an incognito window.
        </p>

        <div className={styles.bottom}>
          <span>© {new Date().getFullYear()} Anwesha, IIT Patna</span>
          <div className={styles.legal}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
