// @flow
import React from 'react';

const PanelIcon = ({color}: {color: string}) => (
	<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
			<rect x="8" y="6" width="36" height="36" rx="4" fill="white"/>
		</g>
		<rect x="12" y="10" width="28" height="28" rx="2" fill={color}/>
		<path fillRule="evenodd" clipRule="evenodd" d="M20 19C20 18.44 20.44 18 21 18H28V30H21C20.44 30 20 29.55 20 29V19ZM22 21H26V22H22V21ZM26 23H22V24H26V23ZM22 25H26V26H22V25Z" fill="#5F5F5F"/>
		<path d="M32 19C32 18.44 31.55 18 31 18H29V30H31C31.55 30 32 29.55 32 29V19Z" fill="#5F5F5F"/>
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

export default PanelIcon;
