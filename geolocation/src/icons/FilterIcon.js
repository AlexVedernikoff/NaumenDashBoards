// @flow
import React from 'react';

const PanelIcon = ({color, active}: Object) => (
	<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
		<rect x="8" y="6" width="36" height="36" rx="4" fill="white"/>
		</g>
		<rect x="12" y="10" width="28" height="28" rx="2" fill={color}/>
		<path d="M32 18H20V19.7622C20 20.0306 20.1079 20.2877 20.2994 20.4758L24.4012 24.503C24.7842 24.879 25 25.3933 25 25.9301V31L27 30V25.9301C27 25.3933 27.2158 24.879 27.5988 24.503L31.7006 20.4758C31.8921 20.2877 32 20.0306 32 19.7622V18Z" fill="#5F5F5F"/>
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
