'use client'

import React, { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
// import Link from 'next/link'
// import { Josefin_Sans } from '@next/font/google'
// import HomeBackgroundAnimation from '../components/Rive/homeBackgrounAnim'
import styles from '../styles/homepage.module.css'
import SoundPlayer from './jumscare_sound'
import VideoPlayer from './jumscare'
// import DisplayRiveAnwesha from '../components/Rive/DisplayRiveAnwesha'
// import DisplayRiveAdmin from '../components/Rive/DisplayRiveAdmin'
// import DisplayRiveSAC from '../components/Rive/DisplayRiveSAC'
// import DisplayRiveGymkhana from '../components/Rive/DisplayRiveGymkhana'
// import DisplayRiveEvent from '../components/Rive/DisplayRiveEvent'
// import EliteTicket from '../components/Rive/EliteTicket'
// import ProTicket from '../components/Rive/ProTicket'
// import RegisterButton from '../components/Rive/RegisterButton'
// import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
// import { Carousel } from 'react-responsive-carousel'
// import AwesomeSlider from 'react-awesome-slider'
// import 'react-awesome-slider/dist/styles.css'
// import { motion } from 'framer-motion'
import CountdownTimer from './jumscaretimeout'
import HeroSection from '../components/Hero/Hero'
import EventDetailsModal from '../components/BigModal'
// import Spline from '@splinetool/react-spline';
import { useRouter } from 'next/router'

const dmSerif = { className: 'font-dm-serif' }

const cn = (...classes) => {
    return classes.filter(Boolean).join(' ')
}
function repeatArray(arr, times) {
    let result = []
    for (let i = 0; i < times; i++) {
        result = result.concat(arr)
    }
    return result
}
const adjustList = (arr, length) => {
    if (arr.length < length) {
        let difference = length - arr.length
        arr = repeatArray(arr, difference + 1)
    }
    return arr
}
const FireSkullHeadLeft = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="185"
            height="55"
            viewBox="0 0 185 55"
            fill="none"
        >
            <path
                d="M119.227 6.19093C119.17 5.60493 117.714 4.71992 117.273 4.76192C116.832 4.80392 115.137 4.84594 114.829 3.64094C114.521 2.43594 115.137 2.04393 115.305 1.93193C115.473 1.81993 117.07 2.88492 117.995 2.63292C118.919 2.38092 126.736 0.951934 127.801 0.895934C128.866 0.839934 137.887 8.54393 138.503 10.4499C139.119 12.3549 138.265 21.6559 137.592 22.8329C136.92 24.0099 135.154 25.6489 134.272 27.5399C133.389 29.4309 132.255 33.6759 131.708 33.8859C131.162 34.0959 124.102 35.6089 123.429 35.6929C122.757 35.7769 112.167 32.7929 109.015 33.4659C105.863 34.1379 96.8425 36.3099 93.4805 41.8009C90.1185 47.2919 88.5495 51.5789 87.1205 51.9149C85.6915 52.2509 78.6315 53.9319 77.4545 54.0999C76.2775 54.2679 67.2845 49.5609 64.7635 47.2079C62.2415 44.8549 38.6245 24.1789 34.9265 23.5059C31.2285 22.8339 20.6385 25.8589 17.2765 26.6999C13.9145 27.5399 8.19946 25.4389 6.43446 24.3469C4.66946 23.2539 3.60448 15.9699 3.66048 15.1299C3.71648 14.2899 4.89348 11.9359 4.38948 10.5909C3.88548 9.24592 0.635483 11.1509 0.635483 11.1509C0.635483 11.1509 3.71748 8.96592 5.62248 9.74992C7.52748 10.5339 4.66948 13.6159 4.61348 15.0169C4.55748 16.4179 7.52748 20.0599 8.14348 20.4519C8.75948 20.8439 21.5915 19.9479 23.0485 19.8359C24.5055 19.7239 37.9535 15.9139 40.6425 15.9139C43.3315 15.9139 52.5775 22.5819 53.8665 23.6459C55.1555 24.7109 60.8145 23.8139 61.4305 23.3099C62.0465 22.8059 61.6545 19.3319 61.9905 18.8269C62.3265 18.3229 65.7445 18.3229 67.7055 19.7789C69.6665 21.2359 70.5635 25.1019 70.6195 26.0549C70.6755 27.0079 68.6025 26.7269 68.6025 27.9599C68.6025 29.1929 79.9775 36.8689 81.5455 36.5329C83.1145 36.1969 91.6315 34.5159 95.9455 32.7789C100.259 31.0419 106.031 20.0039 106.031 17.8739C106.031 15.7439 107.376 13.2789 109.169 12.6069C110.962 11.9349 116.341 9.46892 117.518 8.96492C118.695 8.45992 119.311 7.05893 119.227 6.19093Z"
                fill="#A10000"
            />
            <path
                d="M134.319 15.2669C134.241 15.1249 133.463 13.911 133.427 13.697C133.391 13.483 133.195 12.9299 133.052 12.9299C132.909 12.9299 131.607 14.6239 131.5 15.0529C131.393 15.4809 131.25 19.584 131.357 19.869C131.464 20.154 132.407 22.3839 132.819 22.4019C133.23 22.4199 133.213 21.1179 133.284 20.7969C133.356 20.4749 134.602 15.7819 134.319 15.2669Z"
                fill="#FBFF00"
            />
            <path
                d="M127.642 13.549C127.868 13.388 129.093 10.2909 128.831 10.1719C128.569 10.0529 127.808 10.2669 127.642 10.3619C127.475 10.4569 124.36 11.242 124.075 11.337C123.79 11.432 121.578 15.118 121.15 15.404C120.722 15.69 117.583 16.8309 117.701 17.0209C117.82 17.2109 118.557 17.354 118.557 17.354C118.557 17.354 118.819 18.305 119.413 18.282C120.007 18.258 124.812 16.974 125.073 16.76C125.335 16.545 127.142 13.906 127.642 13.549Z"
                fill="#FBFF00"
            />
            <path
                d="M127.015 19.3019C126.596 18.9999 125.614 19.302 125.306 19.61C124.998 19.918 121.423 24.317 121.207 24.317C120.991 24.317 115.22 25.0459 114.744 25.3539C114.268 25.6619 109.253 28.828 109.001 29.136C108.749 29.444 109.365 30.004 109.449 30.033C109.533 30.061 110.065 30.7609 110.206 30.7889C110.346 30.8169 114.997 28.856 115.221 28.856C115.445 28.856 122.897 30.033 123.458 30.033C124.018 30.033 127.128 23.5049 127.268 22.8609C127.408 22.2159 127.52 19.6659 127.015 19.3019Z"
                fill="#FBFF00"
            />
            <path
                d="M172.316 13.503C172.316 13.503 176.63 15.184 177.023 15.296C177.415 15.408 179.6 13.503 179.6 13.503C179.6 13.503 177.863 10.525 178.704 10.137C179.544 9.74896 180.553 8.62799 180.553 8.62799L179.432 10.869C179.432 10.869 184.363 15.968 184.363 16.864C184.363 17.761 177.751 21.235 176.462 20.562C175.174 19.891 172.316 13.503 172.316 13.503Z"
                fill="#A10000"
            />
            <path
                d="M57.281 15.4359C57.953 14.7639 57.617 8.54395 57.281 7.70395C56.945 6.86295 54.507 5.51894 53.667 5.60294C52.827 5.68694 45.598 8.71294 44.842 8.62894C44.086 8.54494 43.077 6.52796 43.077 6.52796C43.077 6.52796 43.161 9.97396 44.758 11.571C46.355 13.168 51.062 15.521 52.659 15.437C54.256 15.353 56.273 12.3269 56.273 12.3269L57.281 15.4359Z"
                fill="#A10000"
            />
        </svg>
    )
}
const FireSkullHeadRight = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="185"
            height="55"
            viewBox="0 0 185 55"
            fill="none"
        >
            <path
                d="M65.7716 6.19093C65.8286 5.60493 67.2845 4.71992 67.7255 4.76192C68.1665 4.80392 69.8615 4.84594 70.1695 3.64094C70.4775 2.43594 69.8615 2.04393 69.6936 1.93193C69.5256 1.81993 67.9285 2.88492 67.0035 2.63292C66.0795 2.38092 58.2625 0.951934 57.1975 0.895934C56.1325 0.839934 47.1116 8.54393 46.4956 10.4499C45.8796 12.3549 46.7335 21.6559 47.4065 22.8329C48.0785 24.0099 49.8445 25.6489 50.7265 27.5399C51.6095 29.4309 52.7436 33.6759 53.2906 33.8859C53.8366 34.0959 60.8965 35.6089 61.5695 35.6929C62.2415 35.7769 72.8315 32.7929 75.9835 33.4659C79.1355 34.1379 88.1565 36.3099 91.5185 41.8009C94.8805 47.2919 96.4495 51.5789 97.8785 51.9149C99.3075 52.2509 106.368 53.9319 107.545 54.0999C108.722 54.2679 117.715 49.5609 120.236 47.2079C122.758 44.8549 146.375 24.1789 150.073 23.5059C153.771 22.8339 164.361 25.8589 167.723 26.6999C171.085 27.5399 176.8 25.4389 178.565 24.3469C180.33 23.2539 181.395 15.9699 181.339 15.1299C181.283 14.2899 180.106 11.9359 180.61 10.5909C181.114 9.24592 184.364 11.1509 184.364 11.1509C184.364 11.1509 181.282 8.96592 179.377 9.74992C177.472 10.5339 180.33 13.6159 180.386 15.0169C180.442 16.4179 177.472 20.0599 176.856 20.4519C176.24 20.8439 163.408 19.9479 161.951 19.8359C160.494 19.7239 147.046 15.9139 144.357 15.9139C141.668 15.9139 132.422 22.5819 131.133 23.6459C129.844 24.7109 124.185 23.8139 123.569 23.3099C122.953 22.8059 123.345 19.3319 123.009 18.8269C122.673 18.3229 119.255 18.3229 117.294 19.7789C115.333 21.2359 114.436 25.1019 114.38 26.0549C114.324 27.0079 116.397 26.7269 116.397 27.9599C116.397 29.1929 105.022 36.8689 103.454 36.5329C101.885 36.1969 93.3675 34.5159 89.0536 32.7789C84.7396 31.0419 78.9676 20.0039 78.9676 17.8739C78.9676 15.7439 77.6226 13.2789 75.8296 12.6069C74.0366 11.9349 68.6576 9.46892 67.4806 8.96492C66.3036 8.45992 65.6876 7.05893 65.7716 6.19093Z"
                fill="#A10000"
            />
            <path
                d="M50.6804 15.2669C50.7584 15.1249 51.5364 13.911 51.5724 13.697C51.6084 13.483 51.8044 12.9299 51.9474 12.9299C52.0904 12.9299 53.3924 14.6239 53.4994 15.0529C53.6064 15.4809 53.7494 19.584 53.6424 19.869C53.5354 20.154 52.5924 22.3839 52.1804 22.4019C51.7694 22.4199 51.7864 21.1179 51.7154 20.7969C51.6434 20.4749 50.3974 15.7819 50.6804 15.2669Z"
                fill="#FBFF00"
            />
            <path
                d="M57.3574 13.549C57.1314 13.388 55.9064 10.2909 56.1684 10.1719C56.4304 10.0529 57.1914 10.2669 57.3574 10.3619C57.5244 10.4569 60.6394 11.242 60.9244 11.337C61.2094 11.432 63.4214 15.118 63.8494 15.404C64.2774 15.69 67.4164 16.8309 67.2984 17.0209C67.1794 17.2109 66.4424 17.354 66.4424 17.354C66.4424 17.354 66.1804 18.305 65.5864 18.282C64.9924 18.258 60.1874 16.974 59.9264 16.76C59.6644 16.545 57.8574 13.906 57.3574 13.549Z"
                fill="#FBFF00"
            />
            <path
                d="M57.9837 19.3019C58.4027 18.9999 59.3847 19.302 59.6927 19.61C60.0007 19.918 63.5757 24.317 63.7917 24.317C64.0077 24.317 69.7787 25.0459 70.2547 25.3539C70.7307 25.6619 75.7457 28.828 75.9977 29.136C76.2497 29.444 75.6337 30.004 75.5497 30.033C75.4657 30.061 74.9337 30.7609 74.7927 30.7889C74.6527 30.8169 70.0017 28.856 69.7777 28.856C69.5537 28.856 62.1017 30.033 61.5407 30.033C60.9807 30.033 57.8707 23.5049 57.7307 22.8609C57.5907 22.2159 57.4787 19.6659 57.9837 19.3019Z"
                fill="#FBFF00"
            />
            <path
                d="M12.6827 13.503C12.6827 13.503 8.36874 15.184 7.97574 15.296C7.58374 15.408 5.39874 13.503 5.39874 13.503C5.39874 13.503 7.13574 10.525 6.29474 10.137C5.45474 9.74896 4.44574 8.62799 4.44574 8.62799L5.56674 10.869C5.56674 10.869 0.635742 15.968 0.635742 16.864C0.635742 17.761 7.24774 21.235 8.53674 20.562C9.82474 19.891 12.6827 13.503 12.6827 13.503Z"
                fill="#A10000"
            />
            <path
                d="M127.718 15.4359C127.046 14.7639 127.382 8.54395 127.718 7.70395C128.054 6.86295 130.492 5.51894 131.332 5.60294C132.172 5.68694 139.401 8.71294 140.157 8.62894C140.913 8.54494 141.922 6.52796 141.922 6.52796C141.922 6.52796 141.838 9.97396 140.241 11.571C138.644 13.168 133.937 15.521 132.34 15.437C130.743 15.353 128.726 12.3269 128.726 12.3269L127.718 15.4359Z"
                fill="#A10000"
            />
        </svg>
    )
}
const BatLeft = ({ width = 85, height = 85 }) => {
    return (
        <Image
            src="/home/left_button.png"
            alt="Bat Left"
            width={width}
            height={height}
            priority
            style={{ transform: 'rotate(-90deg)' }}
        />
    )
}

const BatRight = ({ width = 85, height = 85 }) => {
    return (
        <Image
            src="/home/left_button.png"
            alt="Bat Left"
            width={width}
            height={height}
            priority
            style={{ transform: 'rotate(90deg)' }}
        />
    )
}
// const BatRight = ({ width = 65, height = 85 }) => {
//     return (
//         <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width={width}
//             height={height}
//             viewBox="10 0 65 85"
//             fill="none"
//         >
//             <g clipPath="url(#clip0_865_9817)">
//                 <path
//                     d="M41.2969 50.7915H36.7765C36.939 50.6538 37.1071 50.5009 37.2754 50.3326C38.2049 49.4031 39.1719 47.9709 39.1719 46.0415C39.1719 44.1121 38.2049 42.68 37.2754 41.7505C37.1071 41.5821 36.939 41.4292 36.7765 41.2915H41.2969H41.7969V40.7915C41.7969 38.8663 40.8887 37.3204 39.5873 36.1057C38.2931 34.8978 36.5889 33.9948 34.9201 33.3273C33.2463 32.6578 31.5778 32.2133 30.3311 31.9362C29.7068 31.7975 29.186 31.7003 28.8203 31.6376C28.6778 31.6131 28.5588 31.5939 28.4662 31.5796C25.1457 26.483 24.2969 20.3432 24.2969 15.4165C24.2969 12.929 24.5132 10.7653 24.7295 9.22428C24.7923 8.77733 24.8549 8.38305 24.9123 8.04877C26.9682 11.0158 30.5707 12.7251 33.7102 13.7062C35.4894 14.2622 37.1548 14.5951 38.3746 14.7892C38.985 14.8863 39.4852 14.9489 39.834 14.9872C39.8659 14.9907 39.8965 14.994 39.9259 14.9972C40.0473 21.8612 42.9115 25.4107 45.8473 27.2173C47.3315 28.1306 48.8119 28.5855 49.9191 28.8126C50.4373 28.9189 50.8761 28.9758 51.1986 29.0062C49.6341 37.5204 52.0225 41.9661 54.992 44.2503C56.1801 45.1642 57.4369 45.7123 58.5166 46.0415C57.4369 46.3707 56.1801 46.9188 54.992 47.8327C52.0225 50.1169 49.6341 54.5626 51.1986 63.0768C50.8761 63.1072 50.4373 63.1641 49.9191 63.2705C48.8119 63.4976 47.3315 63.9524 45.8473 64.8657C42.9115 66.6723 40.0473 70.2218 39.9259 77.0858C39.8965 77.089 39.8659 77.0923 39.834 77.0958C39.4852 77.1341 38.985 77.1967 38.3746 77.2938C37.1548 77.4879 35.4894 77.8208 33.7102 78.3768C30.5707 79.3579 26.9682 81.0672 24.9123 84.0342C24.8549 83.7 24.7923 83.3057 24.7295 82.8587C24.5132 81.3177 24.2969 79.154 24.2969 76.6665C24.2969 71.7399 25.1457 65.6 28.4662 60.5034C28.5588 60.4891 28.6778 60.4699 28.8203 60.4454C29.186 60.3828 29.7068 60.2855 30.3311 60.1468C31.5778 59.8697 33.2463 59.4252 34.9201 58.7557C36.5889 58.0882 38.2931 57.1852 39.5873 55.9773C40.8887 54.7626 41.7969 53.2167 41.7969 51.2915V50.7915H41.2969Z"
//                     fill="#FBFF00"
//                     stroke="black"
//                 />
//             </g>
//             <defs>
//                 <clipPath id="clip0_865_9817">
//                     <rect
//                         width="84"
//                         height="84"
//                         fill="white"
//                         transform="translate(0.609375 0.104004)"
//                     />
//                 </clipPath>
//             </defs>
//         </svg>
//     )
// }
const GreenCircle = ({ width = 626, height = 626 }) => {
    return (
        <svg
            className={styles.rotating_circle}
            width={width}
            height={height}
            viewBox="0 0 626 627"
            fill="none"
        >
            <path
                d="M0 0.451904H626V626.452H0V0.451904Z"
                fill="url(#pattern0_865_9905)"
            />
            <defs>
                <pattern
                    id="pattern0_865_9905"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                >
                    <use
                        href="#image0_865_9905"
                        transform="scale(0.00159744)"
                    />
                </pattern>
                <image
                    id="image0_865_9905"
                    width="626"
                    height="626"
                    href="/pics/circle_green.png"
                />
            </defs>
        </svg>
    )
}
const MuteIcon = ({ width = 48, height = 48 }) => {
    return (
        <svg fill="#000000" height={height} width={width} viewBox="0 0 60 60">
            <g>
                <path
                    d="M51.707,8.293c-0.391-0.391-1.023-0.391-1.414,0l-42,42c-0.391,0.391-0.391,1.023,0,1.414C8.488,51.902,8.744,52,9,52
		        s0.512-0.098,0.707-0.293l42-42C52.098,9.316,52.098,8.684,51.707,8.293z"
                />
                <path
                    d="M52.841,10.561L42,21.402v27.491C42,50.606,40.606,52,38.893,52c-0.547,0-1.09-0.149-1.571-0.432
		        c-0.063-0.037-0.121-0.081-0.174-0.131L24.106,39.296L10.561,52.841C15.982,57.469,22.795,60,30,60
		        c8.013,0,15.547-3.121,21.213-8.787S60,38.013,60,30C60,22.795,57.469,15.982,52.841,10.561z"
                />
                <path
                    d="M15.104,39C13.392,39,12,37.607,12,35.896V23.104C12,21.393,13.392,20,15.104,20h8.324c0.166,0,0.329-0.037,0.479-0.109
		        L37.148,7.563c0.053-0.05,0.112-0.094,0.174-0.131C37.803,7.149,38.346,7,38.893,7C40.606,7,42,8.394,42,10.106v4.479l7.433-7.432
		        C44.013,2.529,37.203,0,30,0C21.987,0,14.453,3.121,8.787,8.787C3.121,14.453,0,21.987,0,30c0,7.202,2.528,14.013,7.153,19.432
		        L17.586,39H15.104z"
                />
            </g>
        </svg>
    )
}
const UnmuteIcon = ({ width = 48, height = 48 }) => {
    return (
        <svg fill="#000000" height={height} width={width} viewBox="0 0 60 60">
            <g>
                <path
                    d="M30,0C13.458,0,0,13.458,0,30s13.458,30,30,30s30-13.458,30-30S46.542,0,30,0z M42,48.894C42,50.606,40.606,52,38.893,52
	            c-0.547,0-1.09-0.149-1.571-0.432c-0.063-0.037-0.121-0.081-0.174-0.131L23.906,39.109C23.756,39.037,23.593,39,23.427,39h-8.324
	            C13.392,39,12,37.607,12,35.896V23.104C12,21.393,13.392,20,15.104,20h8.324c0.166,0,0.329-0.037,0.479-0.109L37.148,7.563
	            c0.053-0.05,0.112-0.094,0.174-0.131C37.803,7.149,38.346,7,38.893,7C40.606,7,42,8.394,42,10.106V48.894z"
                />
            </g>
        </svg>
    )
}

function all(iterable) {
    for (var index = 0; index < iterable.length; index++) {
        if (!iterable[index]) return false
    }
    return true
}

const makePosterUrl = (url) => {
    if (!url) return '/events/poster.png'

    // If it's already an absolute URL, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }

    // If it's a relative path, prepend NEXT_PUBLIC_MEDIA_BASE
    const mediaBase =
        process.env.NEXT_PUBLIC_MEDIA_BASE ||
        'https://storage.googleapis.com/anwesha-storage-bucket'
    return `${mediaBase}/${url}`
}

const ImageWithText = ({
    url,
    title,
    body,
    width,
    height,
    divRef,
    active,
    onClick,
    style,
}) => {
    const posterUrl = makePosterUrl(url)
    return (
        <div
            ref={divRef}
            style={{
                width: width || (active ? '370px' : '319.61px'),
                height: height || (active ? '414px' : '358.481px'),
                backgroundImage: `url(${posterUrl})`,
                ...(style || {}), // Merge additional styles
            }}
            className={styles.events_image}
            onClick={onClick}
        >
            <div>
                <h2>{title}</h2>
                <h3>{body}</h3>
            </div>
        </div>
    )
}

const EventSlider = ({
    images,
    currIndex,
    nextEventImage,
    previouseEventImage,
}) => {
    const offset = 370 + 20

    const imageRefs = useRef([])
    useEffect(() => {
        imageRefs.current = images.map(
            (_, i) => imageRefs.current[i] || React.createRef()
        )
    }, [images])

    const [oldIndex, setOldIndex] = useState(currIndex)
    const [dragStartX, setDragStartX] = useState(null)

    const prev = currIndex === 0 ? images.length - 1 : currIndex - 1
    const next = currIndex + 1 === images.length ? 0 : currIndex + 1
    const prevprev = prev === 0 ? images.length - 1 : prev - 1
    const nextnext = next + 1 === images.length ? 0 : next + 1
    const prevprevprev = prevprev === 0 ? images.length - 1 : prevprev - 1
    const nextnextnext = nextnext + 1 === images.length ? 0 : nextnext + 1

    useEffect(() => {
        if (images.length === 0) return
        if (!imageRefs.current.every((ref) => ref.current)) return
        if (currIndex === oldIndex) return

        if (
            currIndex === oldIndex + 1 ||
            (currIndex === 0 && oldIndex === images.length - 1)
        ) {
            // Toward left
            imageRefs.current[prevprevprev].current.style.zIndex = '-1'
            imageRefs.current[prevprev].current.style.zIndex = '1'
            imageRefs.current[
                prevprev
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% - ${
                2 * offset
            }px))`
            imageRefs.current[prev].current.style.zIndex = '2'
            imageRefs.current[
                prev
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% - min(50vw - 200px, ${offset}px)))`
            imageRefs.current[currIndex].current.style.zIndex = '3'
            imageRefs.current[
                currIndex
            ].current.style.transform = `translateY(-50%) translateX(calc(-50%))`
            imageRefs.current[next].current.style.zIndex = '2'
            imageRefs.current[
                next
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% + min(50vw - 200px, ${offset}px)))`
            imageRefs.current[nextnext].current.style.zIndex = '-1'
            imageRefs.current[
                nextnext
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% + ${
                2 * offset
            }px))`
        } else if (
            currIndex === oldIndex - 1 ||
            (currIndex === images.length - 1 && oldIndex === 0)
        ) {
            // Toward Right
            imageRefs.current[prevprev].current.style.zIndex = '-1'
            imageRefs.current[
                prevprev
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% - ${
                2 * offset
            }px))`
            imageRefs.current[prev].current.style.zIndex = '2'
            imageRefs.current[
                prev
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% - min(50vw - 200px, ${offset}px)))`
            imageRefs.current[currIndex].current.style.zIndex = '3'
            imageRefs.current[
                currIndex
            ].current.style.transform = `translateY(-50%) translateX(calc(-50%))`
            imageRefs.current[next].current.style.zIndex = '2'
            imageRefs.current[
                next
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% + min(50vw - 200px, ${offset}px)))`
            imageRefs.current[nextnext].current.style.zIndex = '1'
            imageRefs.current[
                nextnext
            ].current.style.transform = `translateY(-50%) translateX(calc(-50% + ${
                2 * offset
            }px))`
            imageRefs.current[nextnextnext].current.style.zIndex = '-1'
        }
        setOldIndex(currIndex)
    }, [currIndex, images])

    const dragStart = (e) => {
        const startX = e.touches ? e.touches[0].screenX : e.screenX
        setDragStartX(startX)
    }
    const dragEnd = (e) => {
        if (!dragStartX) return
        const endX = e.changedTouches ? e.changedTouches[0].screenX : e.screenX
        const distance = endX - dragStartX
        if (distance > 10) {
            nextEventImage()
        } else if (distance < 10) {
            previouseEventImage()
        }
        setDragStartX(null)
    }

    return (
        <div
            className={styles.events_images}
            style={{
                minHeight: 414,
                position: 'relative',
            }}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    zIndex: '9',
                }}
                onDragStart={dragStart}
                onDragEnd={dragEnd}
                onTouchStart={dragStart}
                onTouchEnd={dragEnd}
            />
            {images.map((image, index) => (
                <ImageWithText
                    key={index}
                    url={image.url}
                    title={image.title}
                    body={image.body}
                    divRef={imageRefs.current[index]}
                    active={index === currIndex}
                    style={{
                        zIndex:
                            index === currIndex
                                ? '2'
                                : index === prev || index === next
                                ? '1'
                                : '-1',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        backgroundBlendMode:
                            index == currIndex ? 'normal' : 'luminosity',
                        transform:
                            index == currIndex
                                ? `translateY(-50%) translateX(-50%)`
                                : `translateY(-50%) translateX(calc(-50% ${
                                      currIndex > index ? '-' : '+'
                                  } min(50vw - 200px, ${
                                      (currIndex > index
                                          ? currIndex - index
                                          : index - currIndex) * offset
                                  }px)))`,
                        transition:
                            'transform .15s linear, width .15s linear, height .15s linear', // Smooth transition
                    }}
                    onClick={() => router.push(`/events/${image.id}`)}
                />
            ))}
        </div>
    )
}

const SponsorsSlider = ({ images, animation_duration = -1 }) => {
    const width = 127.381 // IF YOU CHANGE THIS THEN CHANGE IT INSIDE autoScrollSponseAnimation ALSO
    const heigth = 127.381
    const duration =
        animation_duration <= 0
            ? Math.floor(10 * (images.length / 7))
            : animation_duration

    const gap = 16
    return (
        <div
            style={{
                position: 'relative',
                backgroundColor: 'inherit',
                // minWidth: width * (images.length + 1),
                minWidth: (width + gap) * images.length,
                height: heigth,
            }}
        >
            {images.map((src, index) => (
                <div
                    key={index}
                    className={styles.autoScrollSponseAnimation}
                    style={{
                        width: '100%',
                        position: 'absolute',
                        left: '100%',
                        // zIndex: 8,
                        animationDelay: `${
                            (duration / images.length) * index
                        }s`,
                        animationDuration: `${duration}s`,
                        '--width': width,
                    }}
                >
                    <Image src={src} width={width} height={heigth} />
                </div>
            ))}
        </div>
    )
}

const ImagesSlider = ({
    images,
    currIndex,
    nextMomentImage,
    previouseMomentImage,
}) => {
    const offset = 864 + 20 // Width of the image + gap (20px)

    // Refs for images to track current position
    const imageRefs = useRef([])

    useEffect(() => {
        imageRefs.current = images.map(
            (_, i) => imageRefs.current[i] || React.createRef()
        )
    }, [images])

    // State to track the animation trigger
    const [oldIndex, setOldIndex] = useState(currIndex)
    const [dragStartX, setDragStartX] = useState(null)

    // Set up transition for images when currIndex changes
    useEffect(() => {
        if (!all(imageRefs.current)) return
        if (currIndex === oldIndex) return
        const prev = currIndex === 0 ? images.length - 1 : currIndex - 1
        const next = currIndex + 1 === images.length ? 0 : currIndex + 1
        const prevprev = prev === 0 ? images.length - 1 : prev - 1
        const nextnext = next + 1 === images.length ? 0 : next + 1
        const prevprevprev = prevprev === 0 ? images.length - 1 : prevprev - 1
        const nextnextnext = nextnext + 1 === images.length ? 0 : nextnext + 1
        if (
            currIndex === oldIndex + 1 ||
            (currIndex === 0 && oldIndex === images.length - 1)
        ) {
            // Toward left
            imageRefs.current[prevprevprev].current.style.zIndex = '-1'
            imageRefs.current[
                prevprevprev
            ].current.style.transform = `translateX(calc(-50% + ${
                3 * offset
            }px))`
            imageRefs.current[prevprev].current.style.zIndex = '4'
            imageRefs.current[
                prevprev
            ].current.style.transform = `translateX(calc(-50% - ${
                2 * offset
            }px))`
            imageRefs.current[prev].current.style.zIndex = '3'
            imageRefs.current[
                prev
            ].current.style.transform = `translateX(calc(-50% - ${offset}px)`
            imageRefs.current[currIndex].current.style.zIndex = '5'
            imageRefs.current[
                currIndex
            ].current.style.transform = `translateX(calc(-50%))`
            imageRefs.current[next].current.style.zIndex = '2'
            imageRefs.current[
                next
            ].current.style.transform = `translateX(calc(-50% + ${offset}px)`
            imageRefs.current[nextnext].current.style.zIndex = '1'
            imageRefs.current[
                nextnext
            ].current.style.transform = `translateX(calc(-50% + ${
                2 * offset
            }px))`
        } else if (
            currIndex === oldIndex - 1 ||
            (currIndex === images.length - 1 && oldIndex === 0)
        ) {
            // Toward Right
            imageRefs.current[prevprev].current.style.zIndex = '1'
            imageRefs.current[
                prevprev
            ].current.style.transform = `translateX(calc(-50% - ${
                2 * offset
            }px))`
            imageRefs.current[prev].current.style.zIndex = '2'
            imageRefs.current[
                prev
            ].current.style.transform = `translateX(calc(-50% - ${offset}px)`
            imageRefs.current[currIndex].current.style.zIndex = '5'
            imageRefs.current[
                currIndex
            ].current.style.transform = `translateX(calc(-50%))`
            imageRefs.current[next].current.style.zIndex = '3'
            imageRefs.current[
                next
            ].current.style.transform = `translateX(calc(-50% + ${offset}px)`
            imageRefs.current[nextnext].current.style.zIndex = '4'
            imageRefs.current[
                nextnext
            ].current.style.transform = `translateX(calc(-50% + ${
                2 * offset
            }px))`
            imageRefs.current[nextnextnext].current.style.zIndex = '-1'
            imageRefs.current[
                nextnextnext
            ].current.style.transform = `translateX(calc(-50% - ${
                3 * offset
            }px))`
        }
        setOldIndex(currIndex)
    }, [currIndex])

    const dragStart = (e) => {
        const startX = e.touches ? e.touches[0].screenX : e.screenX
        setDragStartX(startX)
    }
    const dragEnd = (e) => {
        if (!dragStartX) return
        const endX = e.changedTouches ? e.changedTouches[0].screenX : e.screenX
        const distance = endX - dragStartX
        if (distance > 10) {
            previouseMomentImage()
        } else if (distance < 10) {
            nextMomentImage()
        }
        setDragStartX(null)
    }
    // Return the JSX structure with the images
    return (
        <div
            className={styles.moments_images}
            onDragStart={dragStart}
            onDragEnd={dragEnd}
            onTouchStart={dragStart}
            onTouchEnd={dragEnd}
            style={{
                maxWidth: `${864 * 3}px`,
                marginRight: 'auto',
                marginLeft: 'auto',
                position: 'relative',
            }}
        >
            <div
                style={{
                    backgroundColor: '#000300',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    zIndex: '2',
                }}
            />
            {images.map((image, index) => (
                <img
                    src={image}
                    key={index}
                    width={864}
                    height={546}
                    ref={imageRefs.current[index]}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: `translateX(calc(-50% ${
                            currIndex > index ? '-' : '+'
                        } ${
                            (currIndex > index
                                ? currIndex - index
                                : index - currIndex) * offset
                        }px))`,
                        transition: 'transform 0.35s ease-in-out', // Smooth transition
                    }}
                />
            ))}
        </div>
    )
}

const IndexPage = () => {
    const [eventActiveImageIndex, setEventActiveImageIndex] = useState(2) // don't set on boundary
    const [eventActiveImageIndexPrevDir, setEventActiveImageIndexPrevDir] =
        useState(false)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (eventActiveImageIndexPrevDir)
                setEventActiveImageIndex(
                    eventActiveImageIndex === pseudoEventImage.length - 1
                        ? 0
                        : eventActiveImageIndex + 1
                )
            else
                setEventActiveImageIndex(
                    eventActiveImageIndex === 0
                        ? pseudoEventImage.length - 1
                        : eventActiveImageIndex - 1
                )
        }, 3000)
        return () => clearTimeout(timer)
    }, [eventActiveImageIndex])

    const videoRef = useRef(null)
    const [isMuted, setIsMuted] = useState(true) // Start with the video muted
    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted(!isMuted)
        }
    }

    // events thingyy
    const [events, setEvents] = useState([])
    const [specialEvents, setSpecialEvents] = useState([])
    const [selectedSpecialEvent, setSelectedSpecialEvent] = useState(null)
    useEffect(() => {
        let host = process.env.NEXT_PUBLIC_HOST

        async function callAPI() {
            try {
                const res = await fetch(`${host}/events`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const data = await res.json()
                const eventList = data.events || data || []
                setEvents(eventList)

                const specialRes = await fetch(`${host}/events/special`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                })
                const specialData = await specialRes.json()
                const specialList = specialData.events || specialData.special_events ||
                    specialData.specialEvents || specialData.data || specialData || []
                setSpecialEvents(Array.isArray(specialList) ? specialList : [])
            } catch (e) {
                console.log('Failed to fetch')
            }
        }
        callAPI()
    }, [])
    // url - events[<index>].poster_file || events[<index>].poster (prioritize poster_file)
    // title - events[<index>].name.split('#')[0]
    // body - events[<index>].name.split('#')[1]
    const pseudoEventImage = adjustList(
        events.map((event, idx) => {
            const posterUrl =
                event.poster_file || event.poster || '/events/poster.png'
            console.log(`[HomePage] Event ${idx} poster:`, posterUrl)
            return {
                url: posterUrl,
                title: event.name.split('#')[0],
                body: event.name.split('#')[1],
            }
        }),
        6
    )

    const router = useRouter()

    const sponsorImages = [
        'https://drive.google.com/uc?export=view&id=1l_vpcAfYAtr3AP4Md-paIDs8hCW63f8F',
        'https://drive.google.com/uc?export=view&id=1OcvrKTeQ8phRXxsWu0YcyzoAab1mHR49',
        'https://drive.google.com/uc?export=view&id=1PXcineBGikMCaFLUoTTuUQaym8pJ1Sc6',
        'https://drive.google.com/uc?export=view&id=1Z5NoN4Vmqn1fIhUKDLP_sHYEq4q-94Yp',
        'https://drive.google.com/uc?export=view&id=1SLrXJ80AVdQpPUF13I0b7NXbg1v7Nj_U',
        'https://drive.google.com/uc?export=view&id=12QRWpz1VcmGWjpzEhJjY2nWklnMSPyB5',
        'https://drive.google.com/uc?export=view&id=1URhEbkKWoYat8VcvzZRuklBAtnD42G_j',
        'https://drive.google.com/uc?export=view&id=1k_iwlhOsIEFMw-iJ2YAh98QEDCHgtAi5',
        'https://drive.google.com/uc?export=view&id=1tpyLgLBAxsmKnhxiXooqcf8GAKAMMIgM',
        'https://drive.google.com/uc?export=view&id=18dIDe9EUzqScqL1_vAONFhAsGG4PmRF4',
        'https://drive.google.com/uc?export=view&id=1TpQ19hmSOS2TNUJi6oidSw7Y602ft2El',
        'https://drive.google.com/uc?export=view&id=1hWWaY3ziGTs2fAtamI4muzcRP4kQkD7G',
        'https://drive.google.com/uc?export=view&id=15CbVUgi5i_ARRAtobM9_Pn2GjLyBjaAp',
        'https://drive.google.com/uc?export=view&id=1XvW-FVYrOL8aZCsXs4Urw4FzEO7DMjBm',
        // 'https://drive.google.com/uc?export=view&id=1MRbo4eu7KrYeSjq090nmItjAbv_OQEok',
        'https://drive.google.com/uc?export=view&id=1sNg1jeEC5MRsFseSgM7VXPH8iwbBUTOD',
        'https://drive.google.com/uc?export=view&id=1pNXnnkDvLYUYUqU7-dh_ZDxLqZToHjxn',
        'https://drive.google.com/uc?export=view&id=1BqokvuSQnMepjv0y41KTlgcCKeaMuAWO',
        'https://drive.google.com/uc?export=view&id=1CBELU9HNCW-9UPzF5aFNduSti6FT0WO-',
        'https://drive.google.com/uc?export=view&id=1ER70uJpKmRnH8AWQN3xok84_Sesi5zHw',
        'https://drive.google.com/uc?export=view&id=1WJ4_WS3-x-BqtCItSSqQ2AxtxNX723vm',
        'https://drive.google.com/uc?export=view&id=1i3YuJQMgDqE6ig0JqZAEE0Fe_S9Kn0GD',
        'https://drive.google.com/uc?export=view&id=1xcQdl747tYi3ZY3uxeecoVVXjHpLn0J_',
        'https://drive.google.com/uc?export=view&id=18O2pdC3iAelrCxZATs-lZ1ySKyPR7nUp',
        'https://drive.google.com/uc?export=view&id=1wMgI-ijHi7fF6IbNzxtfN-JHhUdUBXja',
        'https://drive.google.com/uc?export=view&id=1eY1Kfmj6-48BvKbezYjLBLLxR5UD0-Dj',
        'https://drive.google.com/uc?export=view&id=1pHeNDNOUVdQmBgv5012bWpeGXjZ6vOJu',
        'https://drive.google.com/uc?export=view&id=1qJfVG_fdIyZxQrURGjUJIefdj_EXJnvX',
        'https://drive.google.com/uc?export=view&id=1YhJLV3VoL9o4lNF8MSf0jqNmOr10EmRs',
        // 'https://drive.google.com/uc?export=view&id=1UaIXFovMDArchg1xgKpO6jN6kx5Je2yD',
        'https://drive.google.com/uc?export=view&id=1TewMkN2e3bI_-ahRpD3sWk5J_7hvnj2Q',
        'https://drive.google.com/uc?export=view&id=1Y5m4LFHEMFWFDJPhsZSpIT02P0U8qU1e',
        'https://drive.google.com/uc?export=view&id=1wKHW-An6PKqP-wBUqPStms4IFg_sH5aR',
    ]

    const [momentsActiveImageIndex, setMomentsActiveImageIndex] = useState(2) // don't set on boundary
    const [momentsActiveImageIndexPrevDir, setMomentsActiveImageIndexPrevDir] =
        useState(true)
    const _pseudoMomentImage = [
        '/pics/moments/dj.png',
        '/pics/moments/band.png',
        '/pics/moments/song.jpg',
    ]
    const pseudoMomentImage = adjustList(_pseudoMomentImage, 6)
    useEffect(() => setMomentsActiveImageIndex(3), [])
    useEffect(() => {
        const timer = setTimeout(() => {
            if (momentsActiveImageIndexPrevDir)
                setMomentsActiveImageIndex(
                    momentsActiveImageIndex === 0
                        ? pseudoMomentImage.length - 1
                        : momentsActiveImageIndex - 1
                )
            else
                setMomentsActiveImageIndex(
                    momentsActiveImageIndex === pseudoMomentImage.length - 1
                        ? 0
                        : momentsActiveImageIndex + 1
                )
        }, 3000)
        return () => clearTimeout(timer)
    }, [momentsActiveImageIndex])

    const nextEventImage = () => {
        setEventActiveImageIndexPrevDir(false)
        setEventActiveImageIndex(
            eventActiveImageIndex === 0
                ? pseudoEventImage.length - 1
                : eventActiveImageIndex - 1
        )
    }
    const previouseEventImage = () => {
        setEventActiveImageIndexPrevDir(true)
        setEventActiveImageIndex(
            eventActiveImageIndex === pseudoEventImage.length - 1
                ? 0
                : eventActiveImageIndex + 1
        )
    }
    const nextMomentImage = () => {
        setMomentsActiveImageIndexPrevDir(false)
        setMomentsActiveImageIndex(
            momentsActiveImageIndex === pseudoMomentImage.length - 1
                ? 0
                : momentsActiveImageIndex + 1
        )
    }
    const previouseMomentImage = () => {
        setMomentsActiveImageIndexPrevDir(true)
        setMomentsActiveImageIndex(
            momentsActiveImageIndex === 0
                ? pseudoMomentImage.length - 1
                : momentsActiveImageIndex - 1
        )
    }

    const [showsound, setShowsound] = useState(false) // Track video visibility
    const [showVideo, setShowVideo] = useState(false) // Track video visibility
    let timeee = 2500

    if (typeof window !== 'undefined' && window.innerWidth < 700) {
        timeee = 1800
    }

    const timer = setTimeout(() => {
        if (showsound) {
            setShowsound(false)
        }
        if (showVideo) {
            setShowVideo(false)
        }
    }, timeee)

    const [countdownTimer, setcountdowntimer] = useState(false)
    const timerui = setTimeout(() => {
        if (countdownTimer) {
            setcountdowntimer(false)
        }
    }, 3000)
    const [loadimg, setloadimg] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setloadimg(false)
        }, 10)
    }, [])

    return (
        <>
            {showsound && <SoundPlayer />}
            {showsound && <VideoPlayer />}
            {countdownTimer && <CountdownTimer />}

            <Head>
                <title>Anwesha 2026</title>
                <meta name="description" content="Anwesha 2026" />
                <link rel="icon" href="./logo_no_bg.svg" />
            </Head>

            <div className={styles.bg}>
                <HeroSection className={styles.hero}>
                    {/* BACKGROUND VIDEO */}
                    <video
                        className={styles.hero_video}
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src="/home/hero_bg.mp4" type="video/mp4" />
                    </video>

                    {/* HERO CONTENT */}
                    <div className={styles.hero_text}>
                        <Image
                            src={'/home/title_text_home.png'}
                            width={1000}
                            height={313}
                            className={styles.hero_title_img}
                            alt="add hero title"
                            priority
                        />
                    </div>

                    <div className={styles.hero_button}>
                        <button
                            className={cn(
                                styles.sexy_button,
                                styles.sexy_button_small
                            )}
                            onClick={() => router.push('/userRegister')}
                        >
                            Register
                        </button>
                        <button
                            className={cn(
                                styles.sexy_button,
                                styles.sexy_button_small
                            )}
                            onClick={() => router.push('/anweshapass')}
                        >
                            Get Passes
                        </button>
                    </div>
                </HeroSection>

                <div className={styles.fixed_bg}>
                    {/* Events */}
                    <section className={styles.events}>
                        <div className={styles.events_title}>
                            <div>
                                <h2 className={dmSerif.className}>
                                    Explore the Events
                                </h2>
                            </div>
                        </div>
                        <div className={styles.events_images_parent}>
                            <button
                                className={styles.bat_scroll_button}
                                onClick={nextEventImage}
                            >
                                <BatLeft />
                            </button>
                            <EventSlider
                                images={pseudoEventImage}
                                currIndex={eventActiveImageIndex}
                                nextEventImage={nextEventImage}
                                previouseEventImage={previouseEventImage}
                            />
                            <button
                                className={styles.bat_scroll_button}
                                onClick={previouseEventImage}
                            >
                                <BatRight />
                            </button>
                        </div>
                        <div className={styles.events_button}>
                            <button
                                className={cn(
                                    styles.sexy_button,
                                    styles.sexy_button_small
                                )}
                                onClick={() => {
                                    router.push('/events')
                                }}
                            >
                                VIEW MORE
                            </button>
                        </div>
                    </section>

                    {/* Special Events */}
                    {specialEvents.length > 0 && (
                        <section className={styles.special_events}>
                            <div className={styles.sexy_title}>
                                <h2 className={dmSerif.className}>Special Events</h2>
                                <h3>Experience the highlights of Anwesha</h3>
                            </div>
                            <div className={styles.special_events_grid}>
                                {specialEvents.slice(0, 3).map((event, index) => {
                                    const poster = event.poster_file || event.poster || event.poster_url || '/events/poster.png'
                                    const title = event.name || event['Event Name'] || 'Special Event'
                                    return (
                                        <button type="button" className={styles.special_event_card}
                                            key={event.id || event._id || `${title}-${index}`}
                                            onClick={() => setSelectedSpecialEvent({
                                                ...event,
                                                poster: event.poster || event.poster_file || event.poster_url,
                                            })}>
                                            <div className={styles.special_event_poster}
                                                style={{ backgroundImage: `url(${poster})` }}>
                                                <span>{title.split('#')[0]}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </section>
                    )}
                    {selectedSpecialEvent && (
                        <EventDetailsModal
                            title={(selectedSpecialEvent.name || selectedSpecialEvent['Event Name'] || 'Special Event').split('#')[0]}
                            body={selectedSpecialEvent}
                            closeHandler={() => setSelectedSpecialEvent(null)}
                        />
                    )}

                    {/* MERCH */}
                    <section className={styles.merch} id="merch">
                        <div className={styles.merch_body}>
                            <div>
                                <h2 className={dmSerif.className}>
                                    Anwesha 2026 Official Merchandise
                                </h2>
                                <h3>Own the Unforgettable Experience</h3>
                            </div>
                            <p>
                                The designs are a fusion of elegance and
                                innovation, capturing the true spirit of
                                Anwesha. T-shirts are made of supreme quality
                                with GSM 200 and 100% cotton, ensuring maximum
                                comfort and durability. Hoodies are made from
                                Premium Quality Woven Cotton with 350+ GSM
                                cloth.
                            </p>
                        </div>
                        <div className={styles.merch_hero}>
                            <div className={styles.merch_background} />
                            <div className={styles.merch_hero_fix}>
                                <div className={styles.merch_tshirts}></div>
                                <div className={styles.merch_button}>
                                    <button
                                        className={cn(
                                            styles.sexy_button,
                                            styles.merch_grab_button
                                        )}
                                        onClick={() =>
                                            window.open(
                                                'https://docs.google.com/forms/d/e/1FAIpQLSduNP0wbd7_7VZQJn8QARluerDm3HjO1lXw7gYwupdx9wt5_Q/viewform?usp=send_form'
                                            )
                                        }

                                        // onClick={() => router.push('/merch')}
                                    >
                                        GRAB NOW
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Anwesha Through the Lens */}
                    <section className={styles.moments}>
                        <div className={styles.sexy_title}>
                            <h2 className={dmSerif.className}>
                                Anwesha Through the Lens
                            </h2>
                            <h3>Relive the Moments That Defined Us</h3>
                        </div>
                        <div className={styles.moments_images_parent}>
                            <div
                                className={cn(
                                    styles.moments_images_top_curve,
                                    styles.moments_images_curve
                                )}
                            />
                            <ImagesSlider
                                images={pseudoMomentImage}
                                currIndex={momentsActiveImageIndex}
                                nextMomentImage={nextMomentImage}
                                previouseMomentImage={previouseMomentImage}
                            />
                            <div
                                className={cn(
                                    styles.moments_images_bottom_curve,
                                    styles.moments_images_curve
                                )}
                            />
                        </div>
                        <br />
                        <div className={styles.moments_button}>
                            <button
                                className={styles.bat_scroll_button}
                                onClick={nextMomentImage}
                            >
                                <BatLeft width={80} height={90} />
                            </button>
                            <button
                                className={cn(
                                    styles.sexy_button,
                                    styles.sexy_button_small
                                )}
                                onClick={() => {
                                    router.push('/gallery')
                                }}
                            >
                                VIEW MORE
                            </button>
                            <button
                                className={styles.bat_scroll_button}
                                onClick={previouseMomentImage}
                            >
                                <BatRight width={80} height={90} />
                            </button>
                        </div>
                    </section>

                    {/* The Aftermovie */}
                    <section className={styles.aftermovie}>
                        <div className={styles.sexy_title}>
                            <h2 className={dmSerif.className}>
                                Anwesha 2025: The Aftermovie
                            </h2>
                            <h3>Last Year&apos;s Magic in 3 Minutes</h3>
                        </div>

                        <div className={styles.aftermovie_video}>
                            <iframe
                                width="1226"
                                height="607"
                                src="https://www.youtube.com/embed/WLTo_hYLc1A?autoplay=1&mute=1&loop=1&playlist=WLTo_hYLc1A&controls=1"
                                title="A Glimpse into Anwesha 2025"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                style={{ borderRadius: '10px' }} // Optional: Adds rounded corners like modern players
                            ></iframe>
                        </div>
                    </section>

                    {/* CTA or This Year's Theme */}
                    <section className={styles.cta}>
                        <div className={styles.sexy_title}>
                            <h2 className={dmSerif.className}>
                                This Year&apos;s Theme
                            </h2>
                            <h3>Palingenesis reverie</h3>
                        </div>
                        <div className={styles.cta_body}>
                            <div className={styles.cta_body_left}>
                                <Image
                                    src={'/home/circle.png'}
                                    width={450}
                                    height={450}
                                    alt="Theme Circle"
                                    className={styles.theme_circle}
                                />
                                <div className={styles.cta_image}>
                                    <Image
                                        src="/home/mascott.png"
                                        alt="Mascot"
                                        width={320}
                                        height={320}
                                    />
                                </div>
                            </div>
                            <div className={styles.cta_body_right}>
                                <p>
                                    From the hush of winter’s wane, Anwesha
                                    blooms when all seemed finished. Rising from
                                    the abyss, broken threads come together, and
                                    what once fractured begins to heal. Where
                                    the dark once called us, we now move toward
                                    the light, dreaming of becoming again.
                                    <br />
                                    <br />
                                    Anwesha returns not as an ending, but as a
                                    rebirth. This is Palingenesis Reverie, a
                                    quiet renewal, a sacred remembering, and a
                                    promise that even after everything, we rise
                                    again.
                                </p>

                                <div className={styles.cta_button}>
                                    <button
                                        className={cn(
                                            styles.sexy_button,
                                            styles.sexy_button_small
                                        )}
                                        onClick={() => {
                                            router.push('/userRegister')
                                        }}
                                    >
                                        REGISTER
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sponsors */}

                    <section className={styles.sponsors}>
                        <div className={styles.sponsors_title}>
                            <h2 className={dmSerif.className}>
                                Our Proud Sponsors
                            </h2>
                            <h3>Strengthening the Vision Together</h3>
                        </div>
                        <div className={styles.sponsors_images_slider}>
                            <SponsorsSlider images={sponsorImages} />
                        </div>
                    </section>

                    {loadimg && (
                        <img width={200} src="/pics/jump.gif" alt="Scary GIF" />
                    )}
                    {loadimg && (
                        <img
                            width={50}
                            src="/pics/final_h.gif"
                            alt="Scary GIF"
                        />
                    )}
                </div>
            </div>
        </>
    )
}
export default IndexPage
