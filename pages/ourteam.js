import Image from 'next/image'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import styles from '../styles/ourteam.module.css'
import {
    Instagram as InstagramIcon,
    Linkedin as LinkedinIcon,
    Mail as MailIcon,
} from 'lucide-react'

function CoordCard({ data, title }) {
    return (
        <>
            <h2 className={styles.teamSubHeading}>{title}</h2>
            {/* <hr className={styles.teamSubHeadingBar} /> */}
            <div className={styles.picContainer}>
                {data.map((item, index) => (
                    <div key={index} className={styles.teamCard}>
                        <div className={styles.flipInner}>
                            <div className={styles.flipFront}>
                                <Image
                                    className={styles.memberImage}
                                    height={220}
                                    width={220}
                                    src={item.image}
                                    alt={item.name}
                                />
                                <div className={styles.teamMemberDetails}>
                                    <div className={styles.memberName}>
                                        <p>{item.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.flipBack}>
                                <Image
                                    src={item.cardBack || '/team/gola.png'}
                                    alt="Card Back"
                                    className={styles.cardBack}
                                    height={360}
                                    width={360}
                                />
                                <div className={styles.socialLinks}>
                                    {item.instagram && (
                                        <>
                                            <a
                                                href={item.instagram}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <InstagramIcon
                                                    size={24}
                                                    className={
                                                        styles.socialIcon
                                                    }
                                                />
                                            </a>
                                            {(item.linkedin || item.email) && (
                                                <div
                                                    className={
                                                        styles.iconDivider
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                    {item.linkedin && (
                                        <>
                                            <a
                                                href={item.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <LinkedinIcon
                                                    size={24}
                                                    className={
                                                        styles.linkedinIcon
                                                    }
                                                />
                                            </a>
                                            {item.email && (
                                                <div
                                                    className={
                                                        styles.iconDivider
                                                    }
                                                />
                                            )}
                                        </>
                                    )}
                                    {item.email && (
                                        <a
                                            href={`mailto:${item.email}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <MailIcon
                                                size={24}
                                                className={styles.socialIcon}
                                            />
                                        </a>
                                    )}
                                </div>
                                <div className={styles.teamMemberDetails}>
                                    <div className={styles.memberName}>
                                        <p>{item.name}</p>
                                    </div>
                                </div>
                                {/* <div className={styles.memberCommitte}>
                                {item.committee}
                            </div> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default function Ourteam() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const titleStyle = {
        opacity: Math.max(0, 1 - scrollY / 300),
        transform: `translateY(${Math.min(50, scrollY / 3)}px)`,
    }

    const bgStyle = {
        backgroundSize: `${100 + scrollY / 10}%`,
    }

    // const n = 4;
    const data = {
        festcoord: [
            {
                name: 'Akshat Jha',
                image: '/team/akshatFC.jpeg',
                instagram:
                    'https://www.instagram.com/_the__akshat?igsh=MXFyMHFtejMxZHV2aQ%3D%3D&utm_source=qr',
                linkedin:
                    'https://www.linkedin.com/in/akshat-jha-2a3a63291/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                email: 'akshat@akshatjha.in',
            },
            {
                name: 'Sparsh Choudhary',
                image: '/team/sparshFC.jpeg',
                instagram: 'https://www.instagram.com/sparsh.5_',
                linkedin:
                    'https://www.linkedin.com/in/sparsh-choudhary-7604aa28a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'sparsh_2301me56@iitp.ac.in',
            },
        ],
        webnapp: [
            {
                name: 'Diptanshu Saurav',
                image: '/team/diptanshuSaurav.jpeg',
                instagram: 'https://www.instagram.com/dip.sauravvv_/',
                linkedin:
                    'https://www.linkedin.com/in/diptanshu-saurav-697495287/',
                email: 'diptanshu_2301mm32@iitp.ac.in ',
            },
            {
                name: 'Anish Kumar',
                image: '/team/anishKumar.jpg',
                instagram: 'https://www.instagram.com/light.anish',
                linkedin: 'https://www.linkedin.com/in/anish-kumar-71779326a',
                email: 'anish_2301mc40@iitp.ac.in',
            },
            {
                name: 'Jatin Kumar',
                image: '/team/jatin.jpeg',
                instagram: 'https://www.instagram.com/Jatin_16_kumar',
                linkedin: 'https://www.linkedin.com/in/jatin-kumar-4357b72a7',
                email: 'jatin_2301ec12@iitp.ac.in',
            },
        ],
        mpr: [
            {
                name: 'Kshitij Vasule',
                image: '/team/kshitij Vasule.jpeg',
                instagram:
                    'https://www.instagram.com/kshitij__121104?igsh=MW42a3hkb3RwYXFtbA%3D%3D&utm_source=qr',
                linkedin:
                    'https://www.linkedin.com/in/kshitij-vasule-36a19a294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                email: 'kshitij_2301me26@iitp.ac.in',
            },
            {
                name: 'Mihika ',
                image: '/team/mihikaSaxena.jpg',
                instagram:
                    'https://www.instagram.com/mihika_saxena11?igsh=ZTRscnM2enN3d2Zv',
                linkedin:
                    'https://www.linkedin.com/in/mihika-saxena-b5bb8a28b/',
                email: 'mihika_2301cs31@iitp.ac.in',
            },
            {
                name: 'Vansh Shrivastava ',
                image: '/team/vanshShrivastava.jpeg',
                instagram: 'https://www.instagram.com/yrulikedisvansh',
                linkedin:
                    'https://www.linkedin.com/in/vansh-shrivastava-a07866290',
                email: 'vansh_2301ec34@iitp.ac.in',
            },
            {
                name: 'Saksham Srivastava ',
                image: '/team/sakshamSrivastava.jpeg',
                instagram: 'https://www.instagram.com/saksham_iitp/',
                linkedin:
                    'https://www.linkedin.com/in/saksham-srivastava-28ba99296/',
                email: 'saksham_2301ec56@iitp.ac.in',
            },
            {
                name: 'Kushal Kesharwani ',
                image: '/team/kushal.jpg',
                instagram: 'https://www.instagram.com/anwesha_iitpatna/',
                linkedin: 'https://linkedin.com/in/username',
                email: 'kushal_2301mc57@iitp.ac.in',
            },
        ],
        TV: [],
        events: [
            {
                name: 'Chaitanya Saagar',
                image: '/team/chaitanyaSaagar.jpeg',
                instagram: 'https://www.instagram.com/chad._.saagar',
                linkedin:
                    'https://www.linkedin.com/in/chaitanya-saagar-476b562a2',
                email: 'chaitanya_2301cs77@iitp.ac.in',
            },
            {
                name: 'Kumar Aryan Raj',
                image: '/team/aryanRaj.jpg',
                instagram: 'https://www.instagram.com/aryan_4.5.3_/',
                linkedin:
                    'https://www.linkedin.com/in/aryan-raj-46a519298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'kumar_2301cb22@iitp.ac.in',
            },
            {
                name: 'Garvit Dua',
                image: '/team/garvitDua.jpg',
                instagram: 'https://www.instagram.com/duagarvit_04/',
                linkedin: 'https://linkedin.com/in/username',
                email: 'garvit_2301mc42@iitp.ac.in',
            },
        ],
        rsp: [
            {
                name: 'Ananya Maldyar ',
                image: '/team/ananya.jpg',
                instagram:
                    'https://www.instagram.com/annie._.2303?igsh=MW55bjVsdGVseTZmcA==',
                linkedin:
                    'https://www.linkedin.com/in/ananya-maldyar-132505298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'ananya_2301ee06@iitp.ac.in',
            },
            {
                name: 'Ajay Kumar saini ',
                image: '/team/gauravSaini.jpg',
                instagram:
                    'https://www.instagram.com/saini.4_?igsh=bmh1ZmlzNzkwam82',
                linkedin:
                    'https://www.linkedin.com/in/ajay-kumar-saini-44b99a284',
                email: 'ajay_2301mm03@iitp.ac.in',
            },
        ],
        hospi: [
            {
                name: 'Garvit B Nahta',
                image: '/team/garvitNahta.webp',
                instagram:
                    'https://www.instagram.com/garvit_n05?igsh=MTdyZHJ1dXpvYTl4OQ==',
                linkedin:
                    'https://www.linkedin.com/in/garvit-b-nahta-4731ab291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'garvit_2301ce10@iitp.ac.in',
            },
            {
                name: 'Aditi Jana',
                image: '/team/aditiJana.jpeg',
                instagram: 'https://www.instagram.com/anwesha_iitpatna/',
                linkedin: 'https://linkedin.com/in/username',
                email: 'aditi_2302vl01@iitp.ac.in',
            },
            {
                name: 'Gargi Tiwari',
                image: '/team/gargiTiwari.png',
                instagram:
                    'https://www.instagram.com/gargitiwari09?igsh=MWNnaHo2YWZmM2swaw==',
                linkedin:
                    'https://www.linkedin.com/in/gargi-tiwari-b3b7a3295?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'gargi_2303me06@iitp.ac.in',
            },
            {
                name: 'Shubham Agrawal',
                image: '/team/shubhamAgrawal.jpg',
                instagram: 'https://www.instagram.com/shubham._agrawal',
                linkedin:
                    'https://www.linkedin.com/in/shubham-agrawal-27a4a6281',
                email: 'shubham_2301ai44@iitp.ac.in',
            },
        ],
        spons: [
            {
                name: 'Tanish Chordiya',
                image: '/team/tanish.jpeg',
                instagram: 'https://www.instagram.com/tanish.chordiya?igsh=MWxocGdqbXloOXo4YQ%3D%3D&utm_source=qr',
                linkedin: 'https://www.linkedin.com/in/tanish-chordiya-70a985322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                email: 'tanish_2301me49@iitp.ac.in',
            },
            {
                name: 'Aditya Satpute',
                image: '/team/aditya.jpeg',
                instagram: 'https://www.instagram.com/aditya_satpute42?igsh=MTQwY3l1Z2tuOGg5Yw==',
                linkedin: 'https://www.linkedin.com/in/aditya-sat?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'adityaSatpute@gmail.com',
            },
            {
                name: 'Somya Shourya',
                image: '/team/somyaShourya.jpg',
                instagram: 'https://www.instagram.com/anwesha_iitpatna/',
                linkedin: 'https://www.linkedin.com/in/somya-shourya-99806b28b',
                email: 'somya_2301me46@iitp.ac.in',
            },
        ],
        cnd: [
            {
                name: 'Yuvan Vanapalli',
                image: '/team/yuvanV.jpg',
                instagram: 'https://www.instagram.com/yuvan_29_2005/',
                linkedin:
                    'https://www.linkedin.com/in/yuvan-vanapalli-2912yv05/',
                email: 'yuvan_2301ee43@iitp.ac.in',
            },
            {
                name: 'Lochan Bhaskaruni',
                image: '/team/LochanBhaskaruni.jpg',
                instagram: 'https://www.instagram.com/lochan_25526/',
                linkedin:
                    'https://www.linkedin.com/in/lochan-bhaskaruni-10176b283/',
                email: 'lochan_2301me28@iitp.ac.in',
            },
            {
                name: 'Koushik Kondaveti',
                image: '/team/koushik.jpg',
                instagram: 'https://www.instagram.com/ft.koushik_lee?igsh=Y29kOTlyZjNzYXo5',
                linkedin:
                    'https://www.linkedin.com/in/kondaveti-koushik-83631a285?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'koushik_2301me25@iitp.ac.in',
            },
            {
                name: 'Tushar Shrivastav',
                image: '/team/tushar.webp',
                instagram: 'https://www.instagram.com/kanha_shrivastav05?igsh=Z2M0dzhuaGI1dWFz',
                linkedin:
                    'https://www.linkedin.com/in/tushar-shrivastav-7333b9298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'Tushar_2301cb44@iitp.ac.in',
            },
            {
                name: 'Jyoti Shikha',
                image: '/team/jyoti.jpg',
                instagram: 'https://www.instagram.com/jyoti.s.207?igsh=MjNobWQycG1maDI0',
                linkedin:
                    'https://www.linkedin.com/in/jyoti-shikha2007?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'jyoti_2301mm08@iitp.ac.in',
            },
        ],
        convenor: [
            {
                name: 'Abhilasha',
                image: '/team/abhilasha.jpg',
                instagram: 'https://www.instagram.com/abhilashhhaaaaa/',
                linkedin: 'https://www.linkedin.com/in/abhilashamishra13/',
                email: 'abhilasha_2101cb02@iitp.ac.in',
            },
            {
                name: 'Yashveer',
                image: '/team/yashveer.jpeg',
                instagram: 'https://instagram.com/yashveer_ahlawat',
                linkedin:
                    'https://www.linkedin.com/in/yashveer-148944257?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                email: 'yashveer_2101ai35@iitp.ac.in',
            },
        ],
        mprAdvisory: [
            {
                name: 'Kumari Ankita',
                image: '/team/ankita.jpg',
                instagram:
                    'https://www.instagram.com/_kumari_ankita?igsh=MWZsZHBvYTIxa2V3Ng==',
                linkedin: 'https://www.linkedin.com/in/kumari-ankita-83579422a',
                email: 'ankita_2101cb33@iitp.ac.in',
            },
            {
                name: 'Gaurang Bansal',
                image: '/team/gaurang.jpg',
                instagram:
                    'https://www.instagram.com/gaurangbansal2612?igsh=aG1qY3FvN2sycThy',
                linkedin:
                    'https://www.linkedin.com/in/gaurang-bansal-921577230',
                email: 'gaurang_2101ee29@iitp.ac.in',
            },
            {
                name: 'Kanishk Singh Solanki',
                image: '/team/kanishk.jpg',
                instagram: 'https://www.instagram.com/username',
                linkedin: 'https://www.linkedin.com',
                email: 'kanishka_2101ph17@iitp.ac.in',
            },
        ],
        eventsAdvisory: [
            {
                name: 'Divyanshee verma',
                image: '/team/divyanshree.jpg',
                instagram:
                    'https://www.instagram.com/ivyansh7_ee?igsh=dzN1dG9oMWFhbDhv',
                linkedin: 'www.linkedin.com/in/divyanshee-verma-215802228',
                email: 'divyanshee_2101cb26@iitp.ac.in',
            },
            {
                name: 'Nikita Srivastava',
                image: '/team/nikita1.jpg',
                instagram: 'https://instagram.com/nikitaasrivastava ',
                linkedin:
                    'https://www.linkedin.com/in/nikita-srivastava-404bba22a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'nikita_2101ce38@iitp.ac.in',
            },
            {
                name: 'Yash Verma',
                image: '/team/yash.jpg',
                instagram: 'https://instagram.com/username',
                linkedin: 'https://linkedin.com/in/username',
                email: '2201ce16_divyam@iitp.ac.in',
            },
            {
                name: 'Shivendra Pratap Singh',
                image: '/team/shivendra.jpg',
                instagram:
                    'https://www.instagram.com/x_ulansis?igsh=YWsybjVmaW9zbmVi',
                linkedin:
                    'https://www.linkedin.com/in/shivendra-pratap-singh-9a392',
                email: '2201ce16_divyam@iitp.ac.in',
            },
        ],
        rspAdvisory: [
            {
                name: 'Gaurav Gupta',
                image: '/team/Profile.png',
                instagram: 'https://instagram.com/username',
                linkedin: 'https://linkedin.com/in/username',
                email: 'Gaurav_2101ce21@iitp.ac.in',
            },
            ,
            {
                name: 'Khushi Pathak',
                image: '/team/khushi.jpg',
                instagram:
                    'https://www.instagram.com/___.darksun._?igsh=bnM4ODBzYTkwaWZt',
                linkedin:
                    'https://www.linkedin.com/in/khushi-pathak-201041236?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'khushi_2101me34@iitp.ac.in',
            },
        ],
        hospiAdvisory: [
            {
                name: 'Aditi Kumari',
                image: '/team/aditi.jpg',
                instagram: 'https://instagram.com/aditi_kumari5907',
                linkedin: 'https://www.linkedin.com/in/aditi-kumari-12b554230',
                email: 'aditi_2101cb05@iitp.ac.in',
            },
            {
                name: 'Devendra Pratap Singh',
                image: '/team/devendra.jpeg',
                instagram: 'https://www.instagram.com/devendrapratap137/',
                linkedin: 'https://www.linkedin.com/in/devendra1307/',
                email: 'devendra_2101ai13@iitp.ac.in',
            },
            {
                name: 'Aruj Gautam',
                image: '/team/aruj.jpg',
                instagram: 'https://www.instagram.com/usernmame',
                linkedin: 'https://www.linkedin.com/in/arujgautam/',
                email: 'aruj_2101ee15@iitp.ac.in',
            },
        ],
        TVAdvisory: [
            {
                name: 'Vankudothu Surya Prakash',
                image: '/team/surya.jpg',
                instagram: 'https://instagram.com/v_s_p_n',
                linkedin:
                    'https://www.linkedin.com/in/surya-prakash-vankudothu-845484227?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'vankudothu_2101mc46@iitp.ac.in',
            },
        ],
        webnappAdvisory: [
            {
                name: 'Aritra Bhaduri',
                image: '/team/aritra.jpg',
                instagram: 'https://instagram.com/username',
                linkedin: 'https://www.linkedin.com/in/aritrabhaduri/',
                email: 'aritra_2101ai40@iitp.ac.in',
            },
            {
                name: 'Anurag Deo',
                image: '/team/anuragdeo.png',
                instagram: 'https://www.instagram.com/anurag_deo_03/',
                linkedin: 'https://www.linkedin.com/in/anurag-deo-8b30b422b',
                email: 'anurag_2101ai04@iitp.ac.in',
            },
            {
                name: 'Arvind Meena',
                image: '/team/arvind.jpg',
                instagram: 'https://www.instagram.com/arvind_meena2005/',
                linkedin: 'https://www.linkedin.com/in/arvindri2005',
                email: 'arvind_2101ee16@iitp.ac.in',
            },
        ],
        sponsAdvisory: [
            {
                name: 'Aviral Srivastava',
                image: '/team/aviral.jpg',
                instagram:
                    'https://www.instagram.com/aviral_2393?igsh=MXg2ZnRhYWl2Yzl6eQ==',
                linkedin:
                    'https://www.linkedin.com/in/aviral-srivastava23?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'aviral_2101ee88@iitp.ac.in',
            },
            {
                name: 'Ritvik Kadiri',
                image: '/team/ritvik.JPG',
                instagram: 'https://www.instagram.com/username',
                linkedin:
                    'https://www.linkedin.com/in/venkata-sai-ritvik-kadiri-178a5022a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
                email: 'kadiri_2101mc24@iitp.ac.in',
            },
            {
                name: 'Suryansh Bansal',
                image: '/team/suryansh.jpg',
                instagram: 'https://www.instagram.com/username',
                linkedin:
                    'https://www.linkedin.com/in/suryansh-bansal-09507b241?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                email: 'suryansh_2101cb58@iitp.ac.in',
            },
        ],
        PnDAdvisory: [
            {
                name: 'Dhrutisundar Sahoo',
                image: '/team/dhrutisundar.jpg',
                instagram: 'https://www.instagram.com/__infinite.d.__/',
                linkedin: 'https://linkedin.com/in/dhrutisundar-sahoo/',
                email: 'dhrutisundar_2101ee26@iitp.ac.in',
            },
            {
                name: 'Diptadip Malik',
                image: '/team/diptadip.jpg',
                instagram:
                    'https://www.instagram.com/_._d1pt0_._?igsh=MW9kNXYxZnAycmIwNQ==',
                linkedin: 'https://www.linkedin.com/in/dipto21',
                email: 'user@example.com',
            },
            {
                name: 'Varesh',
                image: '/team/varesh.jpg',
                instagram: 'javascript:void(0)',
                linkedin: 'https://linkedin.com/in/vareshmukhekar',
                email: ' varesh_2101mm37@iitp.ac.in',
            },
            {
                name: 'Arkadeep Acharya',
                image: '/team/arkadeep.jpg',
                instagram:
                    'https://www.instagram.com/arkadeep.acharya_03?igsh=b3p6c3UxYXlrOTJi',
                linkedin:
                    'https://www.linkedin.com/in/arkadeep-acharya-404b41226/',
                email: ' arkadeep_2101ai41@iitp.ac.in',
            },
            {
                name: 'Vikramaditya',
                image: '/team/vikramaditya.jpeg',
                instagram:
                    'https://www.instagram.com/lord_raven_73?igsh=ZHh0MXJweWFhdGlr&utm_source=qr',
                linkedin:
                    'https://www.linkedin.com/in/vikramaditya-k-76a93a247?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app',
                email: ' kondepudi_2101cb31@iitp.ac.in',
            },
        ],
    }

    return (
        <div className={styles.parentContainer}>
            <Head>
                <title>Team - Anwesha 2027</title>
                <meta name="description" content="Team-Anwesha 2024" />
                {/* <link rel="icon" href="./logo_no_bg.svg" /> */}
            </Head>

            <div className={styles.fullPageTitle} style={bgStyle}>
                <div className={styles.titleOverlay} style={titleStyle}>
                    <p className={styles.subTitle}>TEAM</p>
                    <p className={styles.mainTitle}>
                        <span className={styles.firstLetter}>A</span>NWESHA
                        <span className={styles.lastNumber}>&apos;26</span>
                    </p>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.coordinators}>
                    {/* {[...Array(n)].map((e, i) =>  */}
                    <CoordCard
                        data={data.festcoord}
                        title={
                            <>
                                <span>Fest</span>
                                <br />
                                <span>Coordinator</span>
                            </>
                        }
                    />
                    <hr className={styles.teamHeadingBar} />

                    <CoordCard
                        data={data.mpr}
                        title={
                            <>
                                <span>MPR</span>
                                <br />
                                <span>Committee</span>
                            </>
                        }
                    />
                    <CoordCard
                        data={data.spons}
                        title={
                            <>
                                <span>Spons</span>
                                <br />
                                <span>Committee</span>
                            </>
                        }
                    />
                    <CoordCard
                        data={data.webnapp}
                        title={
                            <>
                                <span>Web &</span>
                                <br />
                                <span>App</span>
                            </>
                        }
                    />
                    <CoordCard
                        data={data.events}
                        title={
                            <>
                                <span>Events</span>
                                <br />
                                <span>Committee</span>
                            </>
                        }
                    />
                    <CoordCard
                        data={data.rsp}
                        title={
                            <>
                                <span>RSP</span>
                                <br />
                                <span>Committee</span>
                            </>
                        }
                    />
                    <CoordCard
                        data={data.hospi}
                        title={
                            <>
                                <span>Hospitality</span>
                                <br />
                                <span>Committee</span>
                            </>
                        }
                    />
                    <CoordCard
                        data={data.cnd}
                        title={
                            <>
                                <span>Production &</span>
                                <br />
                                <span>Design</span>
                            </>
                        }
                    />

                    {/* <h2 className={styles.teamHeader}>Fest Convenor</h2>
                    <hr className={styles.teamHeadingBar} />
                    <CoordCard data={data.convenor} title="Convenor" />
                    <h2 className={styles.teamHeader}>Advisory</h2>
                    <hr className={styles.teamHeadingBar} />

                    <CoordCard
                        data={data.sponsAdvisory}
                        title="Spons"
                    />
                    <CoordCard data={data.mprAdvisory} title="MPR" />
                    <CoordCard data={data.webnappAdvisory} title="Web & App" />
                    <CoordCard
                        data={data.eventsAdvisory}
                        title="Events "
                    />
                    <CoordCard data={data.rspAdvisory} title="RSP" />
                    <CoordCard
                        data={data.hospiAdvisory}
                        title="Hospitality"
                    />
                    <CoordCard data={data.TVAdvisory} title="Anwesha TV" />
                    <CoordCard data={data.PnDAdvisory} title="Prod & Design" /> */}
                </div>
            </div>
        </div>
    )
}
