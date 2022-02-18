// @flow
import React from 'react';

const ReloadIcon = ({color}: Object) => (
	<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
			<rect x="8" y="6" width="36" height="36" rx="4" fill="white"/>
		</g>
		<rect x="12" y="10" width="28" height="28" rx="2" fill={color}/>
		<path d="M29.53 20.46C28.75 19.68 27.74 19.18 26.64 19.04C25.55 18.89 24.44 19.12 23.49 19.67C22.53 20.22 21.79 21.07 21.37 22.09C20.95 23.11 20.88 24.24 21.17 25.31C21.46 26.37 22.09 27.31 22.97 27.98C23.85 28.64 24.92 29.00 26.02 28.99C27.12 28.99 28.19 28.62 29.06 27.94C29.93 27.26 30.55 26.31 30.83 25.25H29.53C29.30 25.89 28.90 26.47 28.36 26.9C27.83 27.34 27.19 27.62 26.51 27.71C25.83 27.81 25.14 27.71 24.51 27.44C23.87 27.168 23.33 26.72 22.94 26.16C22.54 25.67 22.30 24.94 22.26 24.25C22.21 23.57 22.35 22.88 22.65 22.27C22.99 21.66 23.46 21.15 24.06 20.79C24.6438 20.43 25.31 20.25 26.00 20.25C26.49 20.25 26.98 20.35 27.43 20.54C27.88 20.73 28.29 21.01 28.63 21.36L27 23H31V19.00L29.53 20.46Z" fill="#5F5F5F"/>
		<defs>
			<filter id="filter0_d" x="0" y="0" width="52" height="52" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix"/>
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
				<feOffset dy="2"/>
				<feGaussianBlur stdDeviation="4"/>
				<feColorMatrix type="matrix" values="0 0 0 0 0.372549 0 0 0 0 0.372549 0 0 0 0 0.372549 0 0 0 0.24 0"/>
				<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"/>
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
			</filter>
		</defs>
	</svg>
);

export default ReloadIcon;
