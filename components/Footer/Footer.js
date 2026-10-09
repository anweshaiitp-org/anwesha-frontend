"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import clsx from "clsx";
// TO USE More Classes => {cn(className1, className2, className3)}
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
// assets path => '/pics/footer/{name}'

const dmSerif = { className: 'font-dm-serif' };

const Footer = () => {
  const isCA_page = usePathname() === "/campus-ambassador";
  const router = useRouter();
  return (
    <section>
      <div className={clsx(styles.footer, isCA_page && "w-[100vw]")}>
        <div className={styles.right_helobean}>
          <Image
            src="/footer/flower.svg"
            alt="Image description"
            width={180}
            height={120}
          />
        </div>
        <div className={styles.footer_content}>
            <div className={styles.footer_upper}>
              <div className={styles.foter_logo}>
                <Image
                  src="/navbar/logo.svg"
                  alt="Anwesha logo"
                  width={260}
                  height={93}
                />
            </div>
            <div className={styles.social_logo}>
              <div className={styles.social_logo_container}>
                <a
                  href="mailto:anwesha@iitp.ac.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/footer/gmail.svg"
                    alt="Image description"
                    width={90}
                    height={72}
                  />
                </a>
                <a
                  href="https://www.instagram.com/anwesha_iitpatna/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/footer/instagram.svg"
                    alt="Image description"
                    width={90}
                    height={72}
                  />
                </a>
              </div>
              <div className={styles.social_logo_container}>
                <a
                  href="https://www.facebook.com/anwesha.iitpatna/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/footer/facebook.svg"
                    alt="Image description"
                    width={91}
                    height={72}
                  />
                </a>
              </div>
              <div className={styles.social_logo_container}>
                <a
                  href="https://twitter.com/anweshaiitpat/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/footer/twitter.svg"
                    alt="Image description"
                    width={91}
                    height={72}
                  />
                </a>
                <a
                  href="https://www.youtube.com/@AnweshaIITP"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src="/footer/youtube.svg"
                    alt="Image description"
                    width={91}
                    height={72}
                  />
                </a>
              </div>
            </div>
            <div className={styles.footer_address}>
              <h4>
                Anwesha Office, <br />
                Indian Institute of Technology Patna, <br />
                Bihta, Patna - 801103 <br />
                <span
                  onClick={() => router.push("/contact")}
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                >
                  Contact us :
                </span>
                <br />
                For Event issues: +91 8825253741
                <br />
           
                <span style={{ color: "cyan" }}>Note: </span> If the site is
                stuck, please clear site data or login in incognito.
              </h4>
            </div>
          </div>
          {/* <div className={styles.footer_middle}>
                    <div className={styles.footer_nav}>
                        <div className={styles.four_fingure}>
                            {' '}
                            <Link href="">
                                <h3>Events</h3>
                            </Link>
                            <Link href="">
                                <h3>Merch</h3>
                            </Link>
                            <Link href="">
                                <h3>Gellerty</h3>
                            </Link>
                            <Link href="">
                                <h3>Teams</h3>
                            </Link>{' '}
                        </div>
                        <div className={styles.four_fingure}>
                            {' '}
                            <Link href="">
                                <h3>Sponsors</h3>
                            </Link>
                            <Link href="">
                                <h3>Contat Us</h3>
                            </Link>
                            <Link href="">
                                <h3>Profile</h3>
                            </Link>
                            <Link href="">
                                <h3>Get Passes</h3>
                            </Link>{' '}
                        </div>
                    </div>
                </div> */}
          <div className={styles.line_section}>
            <Image
              src="/pics/footer/Line.svg"
              alt="Image description"
              width={500}
              height={50}
              style={{
                width: "100%",
                height: "10px",
                objectFit: "contain",
              }}
            />
          </div>
          <div className={`${styles.footer_lower} ${dmSerif.className}`}>
            <h4
              onClick={() => {
                router.push("/privacy");
              }}
            >
              {" "}
              Privacy Policy{" "}
            </h4>
            <h4
              onClick={() => {
                router.push("/terms");
              }}
            >
              {" "}
              Terms and Condition
            </h4>
          </div>
          {/* <div className={styles.left_helobean}>
                    <Image
                        src="/footer/footer_flower.png"
                        alt="Image description"
                        width={200}
                        height={100}
                    />
                </div> */}
        </div>
      </div>
    </section>
  );
};

export default Footer;
