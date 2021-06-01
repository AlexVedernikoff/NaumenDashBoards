// @flow
import React from 'react';

const PanelIcon = ({color, active}: Object) => (
	<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
			<rect x="8" y="6" width="36" height="36" rx="4" fill="white"/>
		</g>
		<rect x="12" y="10" width="28" height="28" rx="2" fill={color}/>
		<path d="M32 18H20V19.76C20 20.03 20.10 20.27 20.29 20.47L24.40 24.50C24.78 24.87 25 25.39 25 25.93V31L27 30V25.93C27 25.39 27.21 24.87 27.59 24.50L31.70 20.47C31.89 20.28 32 20.03 32 19.76V18Z" fill="#5F5F5F"/>
		{active && (<circle cx="36" cy="14" r="5" fill="#6FCF97" stroke="white" strokeWidth="2"/>)}
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
