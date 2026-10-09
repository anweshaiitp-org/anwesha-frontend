import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "../styles/gallery.module.css";

import { VintageTV } from "../components/tv/VintageTV";
import { galleryImagesManifest } from "../components/Gallery/galleryImagesManifest";

export default function GalleryPage() {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFadeOut(scrollPosition > window.innerHeight / 9);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Convert manifest into objects expected by VintageTV
  const tvImages = galleryImagesManifest.map((url, i) => ({
    name: `Image ${i + 1}`,
    url,
  }));

  // ✅ Put your youtube links here
  const youtubeLinks = [
    "https://www.youtube.com/watch?v=A-5KI2vCuZI",
    "https://www.youtube.com/watch?v=A-5KI2vCuZI",
  ];

  return (
    <>
      <Head>
        <title>Anwesha 2027 Glimpse</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.psyBackground}>
           <div className={styles.psyAurora}></div>
        </div>

        {/* Vintage Background Images - Optimized for performance */}
        {/* Corner decorative images */}
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[5]?.url}')`, left: '3%', top: '10%', width: '140px', height: '180px' }}></div>
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[18]?.url}')`, right: '4%', top: '8%', width: '130px', height: '170px' }}></div>
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[35]?.url}')`, left: '5%', bottom: '12%', width: '120px', height: '160px' }}></div>
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[50]?.url}')`, right: '6%', bottom: '10%', width: '150px', height: '190px' }}></div>
        
        {/* Side accent images */}
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[12]?.url}')`, left: '2%', top: '50%', width: '100px', height: '140px', transform: 'translateY(-50%)' }}></div>
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[42]?.url}')`, right: '2%', top: '45%', width: '110px', height: '150px', transform: 'translateY(-50%)' }}></div>
        
        {/* Center subtle image */}
        <div className={styles.vintageImage} style={{ backgroundImage: `url('${tvImages[25]?.url}')`, left: '50%', bottom: '5%', width: '95px', height: '130px', transform: 'translateX(-50%)', opacity: 0.15 }}></div>
        
        {/* Fullscreen Text with Fading Effect */}
        <div
          className={`${styles.fullscreenText} ${fadeOut ? styles.fadeOut : ""}`}
        >
          <div className={styles.glimpse}>GLIMPSE</div>
          <div className={styles.anwesha}>
            <span className={styles.anweshaA}>A</span>
            NWESHA
            <span className={styles.anwesha24}>&apos;25</span>
          </div>
        </div>

        {/* ✅ TV Section */}
        <div className={styles.tvWrapper}>
          {/* ✅ Debug line (open console) */}
          {console.log("✅ Images passed to TV:", tvImages.length, tvImages[0])}

          <VintageTV images={tvImages} youtubeLinks={youtubeLinks} />
        </div>
      </div>
    </>
  );
}
