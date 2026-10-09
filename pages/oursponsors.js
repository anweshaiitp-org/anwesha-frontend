import Image from 'next/image'
import React from 'react'
import { useEffect, useState, useRef } from 'react'
import styles from '../styles/oursponsors.module.css'

const josefinSans = { className: 'font-josefin' }

const Oursponsors = () => {
    const [year, setYear] = useState('spons26')

    const [isOpen, setIsOpen] = useState(false) // State to manage visibility
    const dropdownRef = useRef(null)
    const toggleDropdown = () => {
        setIsOpen((prev) => !prev) // Toggle dropdown visibility
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false) // Close dropdown
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])
    const data = {
        spons23: [
            {
                name: 'Bihar Art Culture and Youth Department',
                image: 'https://drive.google.com/uc?export=view&id=1nYe6yUwWQZU6pSxS7tDNPhhI7Wz8EMex',
                link: '',
            },
            {
                name: 'Bihar Tourism',
                image: 'https://drive.google.com/uc?export=view&id=1pRqsKrhyTbhOpnxnNOKNTVwQxW4krm-L',
                link: 'https://tourism.bihar.gov.in/',
            },
            {
                name: 'Bihar Rajya Pul Nirman Nigam',
                image: 'https://drive.google.com/uc?export=view&id=1sD17yO4Zwm449d9ilTh9cPRoTeUd4tpy',
                link: 'https://brpnnl.bihar.gov.in/',
            },
            {
                name: 'Bihar State Electronics Development Corporation',
                image: 'https://drive.google.com/uc?export=view&id=1QZLHYPSJsMLQUKssih7HPqU5DwMGkcnc',
                link: 'https://bsedc.bihar.gov.in/',
            },
            {
                name: 'Bihar State Building Construction Corporation Limited',
                image: 'https://drive.google.com/uc?export=view&id=12rzaQ86RQfHFE_T0XGc-c8uRi_sQILRZ',
                link: 'https://bsbccl.bihar.gov.in/New_V/Default.aspx',
            },
            {
                name: 'Union Bank of India',
                image: 'https://drive.google.com/uc?export=view&id=1l4ePbFEg3oRMScjzzYJpGkrtBhjuQIMf',
                link: 'https://www.unionbankofindia.co.in/',
            },
            {
                name: 'State Bank of India',
                image: 'https://drive.google.com/uc?export=view&id=1ZaIoqpx07hc7rkyEBbw1bq_pITZnubsO',
                link: 'https://sbi.co.in/',
            },
            {
                name: 'Coca Cola',
                image: 'https://drive.google.com/uc?export=view&id=1AX0r088eZ8-2YDHAGjgesfHIRc6SGZnw',
                link: 'https://cokestudio.coke2home.com/bharat',
            },
            {
                name: 'Bihar State Aids Control Society',
                image: 'https://drive.google.com/uc?export=view&id=1p8hOVd0EQLZXMak9LRnmRAdH_xHnMVTd',
                link: '',
            },
            {
                name: 'Indian Oil Corporation',
                image: 'https://drive.google.com/uc?export=view&id=1S8D9eehYFohjFcOB4acJxmBgc2q8ZQNk',
                link: 'https://iocl.com/',
            },
            {
                name: 'HDFC',
                image: 'https://drive.google.com/uc?export=view&id=1cPLTNv-8TJDEZDW8F_zYaowHbEWAIor6',
                link: 'https://www.hdfcbank.com/',
            },
            {
                name: 'Ruban Memorial',
                image: 'https://drive.google.com/uc?export=view&id=1NWKWJtXsIjpzx5zLHGwSIYhDwWW9iY8W',
                link: 'https://rubanpatliputrahospital.com/',
            },
            {
                name: 'Paras HMRI',
                image: 'https://drive.google.com/uc?export=view&id=1GURsSfaKltukA9EGBD6EVUIyx3QhKk8l',
                link: 'https://www.parashospitals.com/india/paras-hospitals-patna/centres-of-excellence/orthopaedics',
            },
            {
                name: 'We Excel ',
                image: 'https://drive.google.com/uc?export=view&id=12C9Gaz0ZJ8SWFzTOiqJxztWYKkceRTVS',
                link: 'https://weexcel.in/',
            },
            {
                name: 'La Pintura',
                image: '/sponsors/2023/lapintura.jpeg',
                link: 'https://www.instagram.com/lapinturastudio/?hl=en',
            },
            {
                name: 'EduVitae Services',
                image: 'https://drive.google.com/uc?export=view&id=1SFVfSdzoyyRc2_OEG2ZYX-6R29nZCmPC',
                link: 'https://eduvitae.co.in/',
            },
            {
                name: 'Forum IAS',
                image: 'https://drive.google.com/uc?export=view&id=15Qtv-gOK4CnYHTdnONlURFNnQPv9H5l0',
                link: 'https://forumias.com/ias-coaching-in-patna/',
            },
            {
                name: 'Testbook',
                image: '/sponsors/2023/testbook.png',
                link: 'https://testbook.com/',
            },
            {
                name: 'Ultratech Cement',
                image: 'https://drive.google.com/uc?export=view&id=1Tqa82L1TG-NJ0khVFnMChIo1PNdWzqp4',
                link: 'https://www.ultratechcement.com/',
            },
            {
                name: 'Decathalon',
                image: 'https://drive.google.com/uc?export=view&id=155A3E2w-Xp6M_J16GI3kYn_Kqyf1VM1K',
                link: 'https://www.decathlon.in/',
            },
            {
                name: 'Bihar Khadi',
                image: 'http://kvibbihar.com/images/khadi_logo.png',
                link: 'http://www.biharkhadi.com/',
            },
            {
                name: 'Bizeal "The Dream Bakers"',
                image: '/sponsors/2023/bizeal.png',
                link: 'https://www.bizeal.com/',
            },
            {
                name: 'Basic',
                image: 'https://drive.google.com/uc?export=view&id=1BhFpl6SlDGnMriHJhsO0MttgV6ZoINEa',
                link: '',
            },
            {
                name: 'Bulkinza',
                image: '/sponsors/2023/bulkinza.png',
                link: 'https://bulkinza.com/',
            },
            {
                name: 'Sudha',
                image: 'https://drive.google.com/uc?export=view&id=1g26UGW2z-m4qkJKeF4Ug06dWHcwR8Vlr',
                link: 'https://www.patnadairy.org/',
            },
            {
                name: 'FujiFilm Instax',
                image: 'https://drive.google.com/uc?export=view&id=1G3NIuTFl_Rl-tSy-etc05p6yt5kusNPO',
                link: 'https://fujifilmxindia.com/',
            },
            {
                name: 'Pizza Hut',
                image: 'https://drive.google.com/uc?export=view&id=1WNL6lJ17emyTNqqv8-NXB8IHIHHMNLB1',
                link: 'https://www.pizzahut.co.in/',
            },
            {
                name: 'The Comunity Events',
                image: '/sponsors/2023/thecommunityevents.jpg',
                link: 'https://www.facebook.com/thecommunityevents/',
            },
            {
                name: 'Coffee For You',
                image: '/sponsors/2023/coffeeforyou.png',
                link: '',
            },
        ],
        spons24: [
            {
                partner: 'Clothing & Apparel Partner',
                sponsors: [
                    {
                        // name: 'Allen Cooper',
                        image: 'https://drive.google.com/uc?export=view&id=1sk_dXvHZCLN5QGH8x5ae4vjunza7kdwo',
                        link: 'https://www.allencooperindia.com/',
                    },
                ],
            },
            {
                partner: 'Strategic Partner',
                sponsors: [
                    {
                        // name: 'Bihar Tourism',
                        image: 'https://drive.google.com/uc?export=view&id=1sO3UC-XMYPAggeQ_P3loZCSxjbXKiTzk',
                        link: 'https://tourism.bihar.gov.in',
                    },
                    {
                        // name: 'Bihar Rajya Pul Nirman Nigam',
                        image: 'https://drive.google.com/uc?export=view&id=1sD17yO4Zwm449d9ilTh9cPRoTeUd4tpy',
                        link: 'https://brpnnl.bihar.gov.in',
                    },
                    {
                        // name: 'Bihar Council on Science and Technology',
                        image: 'https://drive.google.com/uc?export=view&id=1UBiVYAM7HGv-tjMiyTofA7_ZCWS959MG',
                        link: 'https://bcstnsdnmd.co.in/home/',
                    },
                    {
                        // name: 'NHAI',
                        image: 'https://drive.google.com/uc?export=view&id=1lvnREbJ84WauvAhwBCrtO7P11HO-HUz9',
                        link: 'https://nhai.gov.in/',
                    },
                    {
                        // name: 'NTPC',
                        image: 'https://drive.google.com/uc?export=view&id=13oaVnvbhSXcAZTTajdcwXVJ-4YjGtRBu',
                        link: 'https://www.ntpc.co.in/',
                    },
                    {
                        // name: 'Startup Bihar',
                        image: 'https://drive.google.com/uc?export=view&id=1Vbu1tCEMNPzoeOqpydOcOSxHlPzVz3up',
                        link: 'https://startup.bihar.gov.in/',
                    },
                ],
            },
            {
                partner: 'Food Partner',
                sponsors: [
                    {
                        // name: 'Biryani',
                        image: 'https://drive.google.com/uc?export=view&id=1NzTZh6D-THmqConUzrZ2tvC3PaJU3Ets',
                        link: 'https://biryanibykilo.com',
                    },
                    {
                        // name: 'Dominos',
                        image: 'https://drive.google.com/uc?export=view&id=1EKapSE6Q9xbDmycY0XecwCEHKjxUqZzO',
                        link: 'https://www.dominos.co.in/',
                    },
                    {
                        // name: 'Waffcha',
                        image: 'https://drive.google.com/uc?export=view&id=1mX_WeCIywRV838QPn8AywiEWTSXSzMbM',
                        link: 'https://www.waffcha.com/',
                    },
                    {
                        // name: 'Wat A Burger',
                        image: 'https://drive.google.com/uc?export=view&id=183hiDaFhULaFvHURLFMCWBPmT7RjMRWI',
                        link: 'https://www.wataburger.in/',
                    },
                ],
            },
            {
                partner: 'Audio Partner',
                sponsors: [
                    {
                        // name: 'Boult',
                        image: 'https://drive.google.com/uc?export=view&id=10JmGTjBV_wliW6EoE4ozwnErEHNWZlGe',
                        link: 'https://www.boultaudio.com/',
                    },
                ],
            },
            {
                partner: 'Banking Partner',
                sponsors: [
                    {
                        // name: 'State Bank of India',
                        image: 'https://drive.google.com/uc?export=view&id=1MLfxr5ipb_m3VUkNCiAB3sc00hxz5fi-',
                        link: 'https://www.sbi.co.in/',
                    },
                ],
            },
            {
                partner: 'Radio Partner',
                sponsors: [
                    {
                        // name: 'Red FM',
                        image: 'https://drive.google.com/uc?export=view&id=12n_N2f4FyomvBlLOELPnGhLjgPdzCfkb',
                        link: 'https://redfmindia.in',
                    },
                ],
            },
            {
                partner: 'Print Partner',
                sponsors: [
                    {
                        // name: 'Times of India',
                        image: 'https://drive.google.com/uc?export=view&id=1Ub5Ntbu30Kp-1dpYSeB0M_QtbjGsiVpI',
                        link: 'https://timesofindia.indiatimes.com/',
                    },
                ],
            },
            {
                partner: 'Event Partner',
                sponsors: [
                    {
                        // name: 'The Community Events',
                        image: 'https://drive.google.com/uc?export=view&id=1AA3qGrGqqTbmfo2DAWmkAWXs8KWTDC07',
                        link: 'https://www.facebook.com/thecommunityevents/',
                    },
                ],
            },
            {
                partner: 'Hydration Partner',
                sponsors: [
                    {
                        // name: 'Hydration',
                        image: 'https://drive.google.com/uc?export=view&id=1NXlcqgtvPwuaGzr0KxNWWaIGvNgUWDax',
                        link: '',
                    },
                ],
            },
            {
                partner: 'Key Partner',
                sponsors: [
                    {
                        // name: 'Bihar State Electronics Development Corporation',
                        image: 'https://drive.google.com/uc?export=view&id=1QZLHYPSJsMLQUKssih7HPqU5DwMGkcnc',
                        link: 'https://bsedc.bihar.gov.in/',
                    },
                ],
            },
        ],

        spons25: [
            {
                partner: 'Associate & Event Partner',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1dXMeVRz2jbkW4oFGbCYeNr2ooNPbx9Ox',
                        link: 'https://www.arista.com',
                    },
                ],
            },
            {
                partner: 'Banking Partner',
                sponsors: [
                    {
                        // name: 'State Bank of India',
                        image: 'https://drive.google.com/uc?export=view&id=1MLfxr5ipb_m3VUkNCiAB3sc00hxz5fi-',
                        link: 'https://www.sbi.co.in',
                    },
                ],
            },
            {
                partner: 'Pronite & Fueling Partner',
                sponsors: [
                    {
                        // name: 'Indian Oil & XP95',
                        image: 'https://drive.google.com/uc?export=view&id=1S8D9eehYFohjFcOB4acJxmBgc2q8ZQNk',
                        link: 'https://www.iocl.com',
                    },
                ],
            },
            {
                partner: 'Cultural Partner',
                sponsors: [
                    {
                        // name: 'Spic Macay',
                        image: 'https://drive.google.com/uc?export=view&id=1a18oT-fdAI_A5oOjKEqAkJYqxsqHhFLf',
                        link: 'https://www.instagram.com/spicmacayofficial/?hl=en',
                    },
                ],
            },
            {
                partner: 'Strategic Partners',
                sponsors: [
                    {
                        // name: 'Software Technology Parks of India',
                        image: 'https://drive.google.com/uc?export=view&id=1tCIRaCaE8h8jSht2kXvrOI8Df_5CSD42',
                        link: 'https://stpi.in',
                    },
                    {
                        // name: 'Department of Industries',
                        image: 'https://drive.google.com/uc?export=view&id=1FOtkwzHkA74tK7uMzHYaxSbz8W-N40EN',
                        link: '',
                    },
                    {
                        // name: 'Startup Bihar',
                        image: 'https://drive.google.com/uc?export=view&id=1Vbu1tCEMNPzoeOqpydOcOSxHlPzVz3up',
                        link: 'https://startup.bihar.gov.in/',
                    },
                    {
                        // name: 'Bihar Tourism',
                        image: 'https://drive.google.com/uc?export=view&id=1pRqsKrhyTbhOpnxnNOKNTVwQxW4krm-L',
                        link: 'https://tourism.bihar.gov.in',
                    },
                    {
                        // name: 'Public Health Engineering Department, Bihar',
                        image: 'https://drive.google.com/uc?export=view&id=1oX-0boxmmSYbzBAVuPGMzUujaru3wm5D',
                        link: 'http://phed.bih.nic.in',
                    },
                    {
                        // name: 'Bihar State AIDS Control Society',
                        image: 'https://drive.google.com/uc?export=view&id=1yCcmexPef2xI3lQXo7wJAzliDEyUIxh-',
                        link: 'http://bsacs.in',
                    },
                    {
                        // name: 'Bihar State Building Construction Corporation Limited',
                        image: 'https://drive.google.com/uc?export=view&id=12rzaQ86RQfHFE_T0XGc-c8uRi_sQILRZ',
                        link: 'https://bsbccl.bihar.gov.in',
                    },
                    {
                        // name: 'Ceigall India Limited',
                        image: 'https://drive.google.com/uc?export=view&id=1CxQTY0H12QpCqC0YziCUZrpCFTnZkTsB',
                        link: 'https://ceigall.com',
                    },
                ],
            },
            {
                partner: 'Food Partners',
                sponsors: [
                    {
                        // name: 'KFC',
                        image: 'https://drive.google.com/uc?export=view&id=1wujyrcqa-j8QVYTJ8aA6NAP8mGQS2w5Z',
                        link: 'https://online.kfc.co.in/',
                    },
                    {
                        // name: 'Waffcha',
                        image: 'https://drive.google.com/uc?export=view&id=1mX_WeCIywRV838QPn8AywiEWTSXSzMbM',
                        link: 'https://www.waffcha.com/',
                    },
                ],
            },
            {
                partner: 'Knowledge Partner',
                sponsors: [
                    {
                        // name: 'Konnifel',
                        image: 'https://drive.google.com/uc?export=view&id=1PSx1RqfdGkvXoKL4e11PuG8X_ORouj4Z',
                        link: 'https://konnifel.com',
                    },
                ],
            },

            {
                partner: 'Media Partners',
                sponsors: [
                    {
                        name: 'Garda Patna',
                        image: 'https://drive.google.com/uc?export=view&id=1VIItQYV-XlG0gld1B_Z1aRPyOmgqQVhV',
                        link: 'https://www.instagram.com/gardapatna/',
                    },
                    {
                        // name: 'Asian Times',
                        image: 'https://drive.google.com/uc?export=view&id=1vYUNAIOyvqXlwoeamDbfaq0aKHN7e5hc',
                        link: 'https://asiantimes.in/',
                    },
                    {
                        // name: 'Explore Bihar',
                        image: 'https://drive.google.com/uc?export=view&id=1qqUiTYE_DT4W2KjzodLJak9EE1R7TfLe',
                        link: 'https://www.instagram.com/explore_bihar/?hl=en',
                    },
                    {
                        name: 'Patna Beats',
                        image: 'https://drive.google.com/uc?export=view&id=10oF_KynDEuXJTsiBOo-U1XBvMrAMMkeP',
                        link: 'https://www.patnabeats.com/lander',
                    },
                ],
            },
            {
                partner: 'Official Music Streaming Partner',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1Bmf3E_gAowCSYOYTWcejKUkHd4xOHJaf',
                        link: 'https://www.jiosaavn.com',
                    },
                ],
            },
            {
                partner: 'Biking Partner',
                sponsors: [
                    {
                        // name: 'KTM',
                        image: 'https://drive.google.com/uc?export=view&id=1kJCVCocwlbbqFqnMQZYKroZJrC1E-7kU',
                        link: 'https://www.ktm.com',
                    },
                ],
            },
            {
                partner: 'Workshop Partner',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1MwgAsHfhTbylFntL0pBjTU992YKzAShA',
                        link: 'https://tech-gyan.in/',
                    },
                ],
            },
            {
                partner: 'Photography Partner',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1G3NIuTFl_Rl-tSy-etc05p6yt5kusNPO',
                        link: 'https://www.fujifilm.com/in/en/consumer/instax',
                    },
                ],
            },
            {
                partner: 'Education Partner',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1mjlgk_6CMinLARP22Q72fTO3bzPXMP8X',
                        link: 'https://www.instagram.com/civilsphodo/',
                    },
                ],
            },

            {
                partner: 'Self Care Partner',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1Hw-atUyrcs5ZQXb3rp84nx3t55LYGmNe',
                        link: 'https://smartandhandsome.in/',
                    },
                ],
            },

            {
                partner: 'Event Sponsor',
                sponsors: [
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1rAyeAtwSJeSXSXaf3SHaSM2e0KFLUJxH',
                        link: 'https://finvasia.com',
                    },
                    {
                        // khadi bihar
                        image: 'https://drive.google.com/uc?export=view&id=1SVi0330iEG31s0sOTjcemIyfJwFG-mwu',
                        link: 'https://www.biharkhadi.com/',
                    },
                    {
                        image: 'https://drive.google.com/uc?export=view&id=179PmT23fZr1DF4yHGkw7JQxQVbqAn9hU',
                        link: 'https://www.plushforher.com/',
                    },
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1nclvMpEH7K9obHTvJKPoGVFFrJ8isq2b',
                        link: 'https://www.instagram.com/dop.aminestore/',
                    },
                    {
                        image: 'https://drive.google.com/uc?export=view&id=1KPRkyISX-Zyv6ILRi8gSYBgLoNC0F2VN',
                        link: 'https://www.instagram.com/priyankas_fashionvilla_/',
                    },
                ],
            },

            {
                partner: 'Key Sponsors',
                sponsors: [
                    {
                        // name: 'Sudha',
                        image: 'https://drive.google.com/uc?export=view&id=1g26UGW2z-m4qkJKeF4Ug06dWHcwR8Vlr',
                        link: 'http://www.sudha.coop',
                    },
                    {
                        // name: 'Red Bull',
                        image: 'https://drive.google.com/uc?export=view&id=1AWiAE20it80F2XaBcx2X6QPHlB932hgz',
                        link: 'https://www.redbull.com',
                    },
                ],
            },
        ],
        spons26: [
            {
                partner: 'Awarness Partner',
                sponsors: [
                    {
                        name: 'PER',
                        image: 'https://drive.google.com/uc?export=view&id=1l_vpcAfYAtr3AP4Md-paIDs8hCW63f8F',
                        link: 'http://www.sudha.coop',
                    },
                ],
            },
            {
                partner: 'Banking Partner',
                sponsors: [
                    {
                        name: 'ICICI',
                        image: 'https://drive.google.com/uc?export=view&id=1OcvrKTeQ8phRXxsWu0YcyzoAab1mHR49',
                        link: 'https://www.icici.bank.in',
                    },
                    {
                        name: 'PNB',
                        image: 'https://drive.google.com/uc?export=view&id=1PXcineBGikMCaFLUoTTuUQaym8pJ1Sc6',
                        link: 'https://pnb.bank.in',
                    },
                    {
                        name: 'SBI',
                        image: 'https://drive.google.com/uc?export=view&id=1SLrXJ80AVdQpPUF13I0b7NXbg1v7Nj_U',
                        link: 'https://sbi.bank.in',
                    },
                    {
                        name: 'HDFC',
                        image: 'https://drive.google.com/uc?export=view&id=1Z5NoN4Vmqn1fIhUKDLP_sHYEq4q-94Yp',
                        link: 'https://www.hdfc.bank.in',
                    },
                ],
            },
            {
                partner: 'E-Governance Partner',
                sponsors: [
                    {
                        name: 'BELTRON',
                        image: 'https://drive.google.com/uc?export=view&id=12QRWpz1VcmGWjpzEhJjY2nWklnMSPyB5',
                        link: 'https://bsedc.bihar.gov.in/en/',
                    },
                ],
            },
            {
                partner: 'Wellness Partner',
                sponsors: [
                    {
                        name: 'SHS',
                        image: 'https://drive.google.com/uc?export=view&id=1URhEbkKWoYat8VcvzZRuklBAtnD42G_j',
                        link: 'https://shs.bihar.gov.in',
                    },
                ],
            },
            {
                partner: 'Infrastructure Partner',
                sponsors: [
                    {
                        name: 'BRPNNL',
                        image: 'https://drive.google.com/uc?export=view&id=1k_iwlhOsIEFMw-iJ2YAh98QEDCHgtAi5',
                        link: 'https://brpnnl.bihar.gov.in',
                    },
                ],
            },
            {
                partner: 'Insurance Partner',
                sponsors: [
                    {
                        name: 'LIC',
                        image: 'https://drive.google.com/uc?export=view&id=1tpyLgLBAxsmKnhxiXooqcf8GAKAMMIgM',
                        link: 'https://licindia.in/hi/buy-online?utm_source=Google&utm_medium=Banner&utm_campaign=PD_LIC_Google_Search_Generic_Jan_Feb_2027&gad_source=1&gad_campaignid=23444935627&gbraid=0AAAAAqqtO5qooHSrKyOOkiODnHA96pXt4&gclid=CjwKCAiA1obMBhAbEiwAsUBbIlkQAYskDW609n6nbzEB_AbR5FadMIozie7C3rC1g-yMln4uTYjEEBoCRnkQAvD_BwE',
                    },
                ],
            },
            {
                partner: 'Housing Partner',
                sponsors: [
                    {
                        name: 'RERA',
                        image: 'https://drive.google.com/uc?export=view&id=18dIDe9EUzqScqL1_vAONFhAsGG4PmRF4',
                        link: 'https://rera.bihar.gov.in',
                    },
                ],
            },
            {
                partner: 'Associate Partner',
                sponsors: [
                    {
                        name: 'Arista',
                        image: 'https://drive.google.com/uc?export=view&id=1TpQ19hmSOS2TNUJi6oidSw7Y602ft2El',
                        link: 'https://www.arista.com/en/',
                    },
                ],
            },
            {
                partner: 'Fragrance Partner',
                sponsors: [
                    {
                        name: 'Denver',
                        image: 'https://drive.google.com/uc?export=view&id=1hWWaY3ziGTs2fAtamI4muzcRP4kQkD7G',
                        link: 'https://denverformen.com',
                    },
                ],
            },
            {
                partner: 'Strategic Partenr',
                sponsors: [
                    {
                        name: 'Ecofit',
                        image: 'https://drive.google.com/uc?export=view&id=15CbVUgi5i_ARRAtobM9_Pn2GjLyBjaAp',
                        link: 'https://theecofit.com',
                    },
                    {
                        name: 'Bsacs',
                        image: 'https://drive.google.com/uc?export=view&id=1eY1Kfmj6-48BvKbezYjLBLLxR5UD0-Dj',
                        link: 'https://bsacs.bihar.gov.in/',
                    },
                    {
                        name: 'Sichai',
                        image: 'https://drive.google.com/uc?export=view&id=1qJfVG_fdIyZxQrURGjUJIefdj_EXJnvX',
                        link: 'https://wrd.bihar.gov.in',
                    },
                ],
            },
            {
                partner: 'Snacking Partner',
                sponsors: [
                    {
                        name: 'Shee Foods',
                        image: 'https://drive.google.com/uc?export=view&id=1XvW-FVYrOL8aZCsXs4Urw4FzEO7DMjBm',
                        link: 'https://shhefood.com',
                    },
                ],
            },
            {
                partner: 'Official Music Streaming Partner',
                sponsors: [
                    {
                        name: 'Jio Saavn',
                        image: '/sponsors/2027/jiosaavn.jpeg',
                        link: 'https://www.jiosaavn.com',
                    },
                ],
            },
            {
                partner: 'Hydration Partner',
                sponsors: [
                    {
                        name: 'HPCL',
                        image: 'https://drive.google.com/uc?export=view&id=1sNg1jeEC5MRsFseSgM7VXPH8iwbBUTOD',
                        link: 'https://sales.hpcl.co.in/bportal/index_sales.jsp#',
                    },
                ],
            },
            {
                partner: 'Registration Partner',
                sponsors: [
                    {
                        name: 'Unstop',
                        image: 'https://drive.google.com/uc?export=view&id=1pNXnnkDvLYUYUqU7-dh_ZDxLqZToHjxn',
                        link: 'https://unstop.com',
                    },
                ],
            },
            {
                partner: 'Workshop Partner',
                sponsors: [
                    {
                        name: 'Shish',
                        image: 'https://drive.google.com/uc?export=view&id=1BqokvuSQnMepjv0y41KTlgcCKeaMuAWO',
                        link: 'https://shishtechnology.com',
                    },
                ],
            },
            {
                partner: 'Technology Partner',
                sponsors: [
                    {
                        name: 'IDnetify',
                        image: 'https://drive.google.com/uc?export=view&id=1CBELU9HNCW-9UPzF5aFNduSti6FT0WO-',
                        link: 'https://www.idnetify.com/',
                    },
                ],
            },
            {
                partner: 'Elegance Partner',
                sponsors: [
                    {
                        name: 'Haven',
                        image: 'https://drive.google.com/uc?export=view&id=1ER70uJpKmRnH8AWQN3xok84_Sesi5zHw',
                        link: 'https://www.haven.com/',
                    },
                ],
            },
            {
                partner: 'Social impact partner',
                sponsors: [
                    {
                        name: 'Umeed',
                        image: 'https://drive.google.com/uc?export=view&id=1WJ4_WS3-x-BqtCItSSqQ2AxtxNX723vm',
                        link: 'https://umeed.org.in/',
                    },
                ],
            },
            {
                partner: 'IT Partner',
                sponsors: [
                    {
                        name: 'DIT',
                        image: 'https://drive.google.com/uc?export=view&id=1i3YuJQMgDqE6ig0JqZAEE0Fe_S9Kn0GD',
                        link: 'https://ditindia.com',
                    },
                ],
            },
            {
                partner: 'Power Partner',
                sponsors: [
                    {
                        name: 'NTPC',
                        image: '/sponsors/2027/National_Thermal_Power_logo.svg',
                        link: 'https://ntpc.co.in',
                    },
                ],
            },
            {
                partner: 'Flashmob Partner',
                sponsors: [
                    {
                        name: 'PnM',
                        image: 'https://drive.google.com/uc?export=view&id=1xcQdl747tYi3ZY3uxeecoVVXjHpLn0J_',
                        link: 'www.pnmmall.com',
                    },
                ],
            },
            {
                partner: 'Health Partner',
                sponsors: [
                    {
                        name: 'Ruban',
                        image: 'https://drive.google.com/uc?export=view&id=18O2pdC3iAelrCxZATs-lZ1ySKyPR7nUp',
                        link: 'https://rubanhospitals.com',
                    },
                ],
            },
            {
                partner: 'Adventure Partner',
                sponsors: [
                    {
                        name: 'Jalalpur Fun',
                        image: 'https://drive.google.com/uc?export=view&id=1wMgI-ijHi7fF6IbNzxtfN-JHhUdUBXja',
                        link: 'https://www.jalalpurfun.in/package.php',
                    },
                ],
            },
            {
                partner: 'Cultural Partner',
                sponsors: [
                    {
                        name: 'Art and Culture',
                        image: 'https://drive.google.com/uc?export=view&id=1YhJLV3VoL9o4lNF8MSf0jqNmOr10EmRs',
                        link: 'https://state.bihar.gov.in/yac/CitizenHome.html',
                    },
                ],
            },
            // {
            //     partner: 'Energy Partner',
            //     sponsors: [
            //         {
            //             name: 'RedBull',
            //             image: 'https://drive.google.com/uc?export=view&id=1UaIXFovMDArchg1xgKpO6jN6kx5Je2yD',
            //             link: 'https://www.redbull.com/in-en',
            //         },
            //     ],
            // },
            {
                partner: 'Construction Partner',
                sponsors: [
                    {
                        name: 'BCD',
                        image: '/sponsors/2027/bcd.jpeg',
                        link: 'https://state.bihar.gov.in/bcd/CitizenHome.html',
                    },
                ],
            },
            {
                partner: 'Dairy Partner',
                sponsors: [
                    {
                        name: 'COMFED',
                        image: '/sponsors/2027/comfed.jpeg',
                        link: 'https://erp.comfed.co.in',
                    },
                ],
            },
            {
                partner: 'Amusement Partner',
                sponsors: [
                    {
                        name: 'Carnival',
                        image: '/sponsors/2027/carnival.jpeg',
                        link: 'www.carnival.com',
                    },
                ],
            },
            {
                partner: 'Knowledge Partner',
                sponsors: [
                    {
                        name: 'Eduxlabs',
                        image: 'https://drive.google.com/uc?export=view&id=1TewMkN2e3bI_-ahRpD3sWk5J_7hvnj2Q',
                        link: 'https://www.eduxlabs.com',
                    },
                ],
            },
            {
                partner: 'Cinema Partner',
                sponsors: [
                    {
                        name: 'Connplex',
                        image: '/sponsors/2027/connplex.jpeg',
                        link: 'https://ticketing.theconnplex.com',
                    },
                ],
            },
            {
                partner: 'Innovation Partner',
                sponsors: [
                    {
                        name: 'IC IIT Patna',
                        image: 'https://drive.google.com/uc?export=view&id=1Y5m4LFHEMFWFDJPhsZSpIT02P0U8qU1e',
                        link: 'https://iciitp.com',
                    },
                ],
            },
            {
                partner: 'Summit Partner',
                sponsors: [
                    {
                        name: 'India Pre AI Summit',
                        image: '/sponsors/2027/aisummit.jpeg',
                        link: 'https://impact.indiaai.gov.in',
                    },
                ],
            },
        ],
        // spons25: [
        //     {
        //         // name: 'ARISTA Networks',
        //         image: 'https://drive.google.com/uc?export=view&id=1dXMeVRz2jbkW4oFGbCYeNr2ooNPbx9Ox',
        //         link: 'https://www.arista.com',
        //         partner: 'Associate & Event Partner',
        //     },
        //     {
        //         // name: 'State Bank of India',
        //         image: 'https://drive.google.com/uc?export=view&id=1MLfxr5ipb_m3VUkNCiAB3sc00hxz5fi-',
        //         link: 'https://www.sbi.co.in',
        //         partner: 'Banking Partner',
        //     },
        //     {
        //         // name: 'Indian Oil & XP95',
        //         image: 'https://drive.google.com/uc?export=view&id=1S8D9eehYFohjFcOB4acJxmBgc2q8ZQNk',
        //         link: 'https://www.iocl.com',
        //         partner: 'Pronite & Fueling Partner',
        //     },
        //     {
        //         // name: 'Spic Macay',
        //         image: 'https://drive.google.com/uc?export=view&id=1a18oT-fdAI_A5oOjKEqAkJYqxsqHhFLf',
        //         link: 'https://www.instagram.com/spicmacayofficial/?hl=en',
        //         partner: 'Cultural Partner',
        //     },
        //     {
        //         name: 'Software Technology Parks of India',
        //         image: 'https://drive.google.com/uc?export=view&id=1tCIRaCaE8h8jSht2kXvrOI8Df_5CSD42',
        //         link: 'https://stpi.in',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         // name: 'Department of Industries',
        //         image: 'https://drive.google.com/uc?export=view&id=1FOtkwzHkA74tK7uMzHYaxSbz8W-N40EN',
        //         link: '',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         // name: 'Startup Bihar',
        //         image: 'https://drive.google.com/uc?export=view&id=1Vbu1tCEMNPzoeOqpydOcOSxHlPzVz3up',
        //         link: 'https://startup.bihar.gov.in/',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         // name: 'Bihar Tourism',
        //         image: 'https://drive.google.com/uc?export=view&id=1pRqsKrhyTbhOpnxnNOKNTVwQxW4krm-L',
        //         link: 'https://tourism.bihar.gov.in',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         name: 'Public Health Engineering Department, Bihar',
        //         image: 'https://drive.google.com/uc?export=view&id=1oX-0boxmmSYbzBAVuPGMzUujaru3wm5D',
        //         link: 'http://phed.bih.nic.in',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         name: 'Bihar State AIDS Control Society',
        //         image: 'https://drive.google.com/uc?export=view&id=1yCcmexPef2xI3lQXo7wJAzliDEyUIxh-',
        //         link: 'http://bsacs.in',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         name: 'Bihar State Building Construction Corporation Limited',
        //         image: 'https://drive.google.com/uc?export=view&id=12rzaQ86RQfHFE_T0XGc-c8uRi_sQILRZ',
        //         link: 'https://bsbccl.bihar.gov.in',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         // name: 'Ceigall India Limited',
        //         image: 'https://drive.google.com/uc?export=view&id=1CxQTY0H12QpCqC0YziCUZrpCFTnZkTsB',
        //         link: 'https://ceigall.com',
        //         partner: 'Strategic Partner',
        //     },
        //     {
        //         // name: 'KFC',
        //         image: 'https://drive.google.com/uc?export=view&id=1wujyrcqa-j8QVYTJ8aA6NAP8mGQS2w5Z',
        //         link: 'https://online.kfc.co.in/',
        //         partner: 'Food Partner',
        //     },
        //     {
        //         // name: 'Waffcha',
        //         image: 'https://drive.google.com/uc?export=view&id=1mX_WeCIywRV838QPn8AywiEWTSXSzMbM',
        //         link: 'https://www.waffcha.com/',
        //         partner: 'Food Partner',
        //     },
        //     {
        //         // name: 'KTM',
        //         image: 'https://drive.google.com/uc?export=view&id=1kJCVCocwlbbqFqnMQZYKroZJrC1E-7kU',
        //         link: 'https://www.ktm.com',
        //         partner: 'Biking Partner',
        //     },
        //     {
        //         // name: 'Konnifel',
        //         image: 'https://drive.google.com/uc?export=view&id=1PSx1RqfdGkvXoKL4e11PuG8X_ORouj4Z',
        //         link: 'https://konnifel.com',
        //         partner: 'Knowledge Partner',
        //     },
        //     {
        //         // name: 'Civil Fodo',
        //         image: 'https://drive.google.com/uc?export=view&id=1mjlgk_6CMinLARP22Q72fTO3bzPXMP8X',
        //         link: 'https://www.instagram.com/civilsphodo/',
        //         partner: 'Education Partner',
        //     },
        //     {
        //         // name: 'JioSaavn',
        //         image: 'https://drive.google.com/uc?export=view&id=1Bmf3E_gAowCSYOYTWcejKUkHd4xOHJaf',
        //         link: 'https://www.jiosaavn.com',
        //         partner: 'Official Music Streaming Partner',
        //     },
        //     {
        //         // name: 'Finvasia',
        //         image: 'https://drive.google.com/uc?export=view&id=1rAyeAtwSJeSXSXaf3SHaSM2e0KFLUJxH',
        //         link: 'https://finvasia.com',
        //         partner: 'Event Sponsor',
        //     },
        //     {
        //         name: 'Garda Patna',
        //         image: 'https://drive.google.com/uc?export=view&id=1VIItQYV-XlG0gld1B_Z1aRPyOmgqQVhV',
        //         link: 'https://www.instagram.com/gardapatna/',
        //         partner: 'Media Partner',
        //     },
        //     {
        //         // name: 'Asian Times',
        //         image: 'https://drive.google.com/uc?export=view&id=1vYUNAIOyvqXlwoeamDbfaq0aKHN7e5hc',
        //         link: 'https://asiantimes.in/',
        //         partner: 'Media Partner',
        //     },
        //     {
        //         // name: 'Explore Bihar',
        //         image: 'https://drive.google.com/uc?export=view&id=1qqUiTYE_DT4W2KjzodLJak9EE1R7TfLe',
        //         link: 'https://www.instagram.com/explore_bihar/?hl=en',
        //         partner: 'Media Partner',
        //     },
        //     {
        //         name: 'Patna Beats',
        //         image: 'https://drive.google.com/uc?export=view&id=10oF_KynDEuXJTsiBOo-U1XBvMrAMMkeP',
        //         link: 'https://www.patnabeats.com/lander',
        //         partner: 'Media Partner',
        //     },
        //     {
        //         // name: 'Techgyaan',
        //         image: 'https://drive.google.com/uc?export=view&id=1MwgAsHfhTbylFntL0pBjTU992YKzAShA',
        //         link: 'https://tech-gyan.in/',
        //         partner: 'Workshop Partner',
        //     },
        //     {
        //         // name: 'Instax Fujifilm',
        //         image: 'https://drive.google.com/uc?export=view&id=1G3NIuTFl_Rl-tSy-etc05p6yt5kusNPO',
        //         link: 'https://www.fujifilm.com/in/en/consumer/instax',
        //         partner: 'Photography Partner',
        //     },
        //     {
        //         // name: 'Smart and Handsome',
        //         image: 'https://drive.google.com/uc?export=view&id=1Hw-atUyrcs5ZQXb3rp84nx3t55LYGmNe',
        //         link: 'https://smartandhandsome.in/',
        //         partner: 'Self Care Partner',
        //     },
        //     {
        //         // name: 'Sudha',
        //         image: 'https://drive.google.com/uc?export=view&id=1g26UGW2z-m4qkJKeF4Ug06dWHcwR8Vlr',
        //         link: 'http://www.sudha.coop',
        //         partner: 'Key Sponsor',
        //     },
        //     {
        //         // name: 'Red Bull',
        //         image: 'https://drive.google.com/uc?export=view&id=1AWiAE20it80F2XaBcx2X6QPHlB932hgz',
        //         link: 'https://www.redbull.com',
        //         partner: 'Key Sponsor',
        //     },
        // ],
    }
    return (
        <div className={styles.parentContainer}>
            <div className={styles.wave} style={{ paddingTop: '4vw' }}>
                <div className={styles.container}>
                    <h2
                        className={styles.teamHeader}
                        style={{
                            color: 'rgb(255, 255, 255)',
                        }}
                    >
                        {' '}
                        OUR SPONSORS
                    </h2>
                    <h4 className={styles.tittle_sponsors}>Title Sponsors</h4>
                    {/* --- Logic Fix: Myntra Card sirf 'spons26' (Current Year) ke liye --- */}
                    {year === 'spons26' && (
                        <div className={styles.sponsorWrapper}>
                            <a
                                href="https://www.myntra.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.sponsorCard}
                            >
                                <div className={styles.logoBox}>
                                    <Image
                                        src="/sponsors/2027/myntra.png"
                                        alt="Myntra Logo"
                                        width={580}
                                        height={220}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>

                                <div className={styles.sponsorText}>
                                    <h3>Myntra</h3>
                                    <p>Title Sponsor</p>
                                </div>
                            </a>
                        </div>
                    )}

                    {/* --- Dropdown Logic (Ye hamesha dikhega taaki user switch kar sake) --- */}
                    <div className={styles.dropdownContainer} ref={dropdownRef}>
                        <button
                            onClick={toggleDropdown}
                            className={styles.dropdownButton}
                        >
                            Previous Years Sponsors
                            <span className={styles.arrow}>▼</span>
                        </button>
                        {isOpen && (
                            <div className={styles.dropdownContent}>
                                <a
                                    onClick={() => setYear('spons24')}
                                    className={
                                        year === 'spons24'
                                            ? styles.disabled
                                            : ''
                                    }
                                >
                                    2024-2025
                                </a>
                                <a
                                    onClick={() => setYear('spons25')}
                                    className={
                                        year === 'spons25'
                                            ? styles.disabled
                                            : ''
                                    }
                                >
                                    2025-2027
                                </a>
                                <a
                                    onClick={() => setYear('spons26')}
                                    className={
                                        year === 'spons26'
                                            ? styles.disabled
                                            : ''
                                    }
                                >
                                    2027-2027
                                </a>
                            </div>
                        )}
                    </div>
                    {/* <div className={styles.coordinators}>
                        <div className={styles.picContainer}>
                            {data[year]?.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        color: 'black',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <div className={styles.teamCard}>
                                        <div className={styles.teamImage}>
                                            {' '}
                                            <Image
                                                src={`${item.image}`}
                                                className={styles.memberImage}
                                                height={220}
                                                width={220}
                                                alt={item.name}
                                            />
                                        </div>
                                        <div
                                            className={styles.teamMemberDetails}
                                        >
                                            <div className={styles.memberName}>
                                                {item.name}
                                            </div>
                                            <div className={styles.partner}>
                                                {item.partner}
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div> */}
                    <div className={styles.coordinators}>
                        <div className={styles.picContainer}>
                            {/* Logic Fix: Check if year is in the list of grouped years */}
                            {['spons26', 'spons25', 'spons24'].includes(
                                year
                            ) ? (
                                // --- BRANCH 1: Grouped by Category (Newer Years) ---
                                data[year]?.map((category, index) => (
                                    <div
                                        key={index}
                                        className={styles.partnerGroup}
                                    >
                                        {/* Category Title (e.g. Banking Partner) */}
                                        <h3 className={styles.partnerHeading}>
                                            {category.partner}
                                        </h3>

                                        <div className={styles.sponsorGrid}>
                                            {category.sponsors.map(
                                                (sponsor, i) => (
                                                    <a
                                                        key={i}
                                                        href={sponsor.link}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={
                                                            styles.sponsorCard
                                                        } // Applied New Style
                                                    >
                                                        <div
                                                            className={
                                                                styles.logoBox
                                                            }
                                                        >
                                                            <Image
                                                                src={
                                                                    sponsor.image
                                                                }
                                                                alt={
                                                                    sponsor.name
                                                                }
                                                                width={140}
                                                                height={130}
                                                                style={{
                                                                    objectFit:
                                                                        'contain',
                                                                    padding:
                                                                        '10px',
                                                                }}
                                                            />
                                                        </div>

                                                        <div
                                                            className={
                                                                styles.sponsorText
                                                            }
                                                        >
                                                            <h3>
                                                                {sponsor.name}
                                                            </h3>
                                                            {/* If the individual sponsor has a specific partner tag, show it, else show category */}
                                                            <p>
                                                                {sponsor.partner ||
                                                                    category.partner}
                                                            </p>
                                                        </div>
                                                    </a>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // --- BRANCH 2: Flat List (Older Years) ---
                                <div className={styles.sponsorGrid}>
                                    {data[year]?.map((sponsor, index) => (
                                        <a
                                            key={index}
                                            href={sponsor.link}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={styles.sponsorCard} // Applied New Style
                                        >
                                            <div className={styles.logoBox}>
                                                <Image
                                                    src={sponsor.image}
                                                    alt={sponsor.name}
                                                    width={220}
                                                    height={160}
                                                    style={{
                                                        objectFit: 'contain',
                                                        padding: '10px',
                                                    }}
                                                />
                                            </div>

                                            <div className={styles.sponsorText}>
                                                <h3>{sponsor.name}</h3>
                                                <p>{sponsor.partner}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Oursponsors
