// @flow
import React from 'react';

const ReloadIcon = ({color}: Object) => (
	<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
			<path d="M8 8C8 6.89543 8.89543 6 10 6H38C39.1046 6 40 6.89543 40 8V36C40 37.1046 39.1046 38 38 38H10C8.89543 38 8 37.1046 8 36V8Z" fill="white"/>
		</g>
		<rect x="12" y="10" width="24" height="24" rx="2" fill={color}/>
		<path d="M30.0043 16.0816C30.2667 15.9393 30.5915 15.9864 30.8025 16.1975C31.0136 16.4085 31.0607 16.7333 30.9184 16.9957L24.546 28.7442C24.4619 28.8992 24.3008 28.9969 24.1244 28.9999C23.8749 29.0042 23.6622 28.8198 23.631 28.5722L23.0479 23.9521L18.4278 23.369C18.1802 23.3378 17.9958 23.1251 18.0001 22.8756C18.0031 22.6992 18.1008 22.5381 18.2558 22.454L30.0043 16.0816Z" fill="#5F5F5F"/>
		<defs>
			<filter id="filter0_d" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
				<feFlood floodOpacity="0" result="BackgroundImageFix"/>
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
				<feOffset dy="2"/>
				<feGaussianBlur stdDeviation="4"/>
				<feColorMatrix type="matrix" values="0 0 0 0 0.504 0 0 0 0 0.574475 0 0 0 0 0.63 0 0 0 0.5 0"/>
				<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"/>
				<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
			</filter>
		</defs>
	</svg>
);

export default ReloadIcon;
