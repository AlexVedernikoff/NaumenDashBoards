// @flow
import React from 'react';

const PanelIcon = ({active, color}: Object) => (
	<svg fill="none" height="52" viewBox="0 0 52 52" width="52" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
			<rect fill="white" height="36" rx="4" width="36" x="8" y="6" />
		</g>
		<rect fill={color} height="28" rx="2" width="28" x="12" y="10" />
		<path d="M32 18H20V19.76C20 20.03 20.10 20.27 20.29 20.47L24.40 24.50C24.78 24.87 25 25.39 25 25.93V31L27 30V25.93C27 25.39 27.21 24.87 27.59 24.50L31.70 20.47C31.89 20.28 32 20.03 32 19.76V18Z" fill="#5F5F5F" />
		{active && (<circle cx="36" cy="14" fill="#6FCF97" r="5" stroke="white" strokeWidth="2" />)}
		<defs>
			<filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="52" id="filter0_d" width="52" x="0" y="0">
				<feFlood floodOpacity="0" result="BackgroundImageFix" />
				<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
				<feOffset dy="2" />
				<feGaussianBlur stdDeviation="4" />
				<feColorMatrix type="matrix" values="0 0 0 0 0.372549 0 0 0 0 0.372549 0 0 0 0 0.372549 0 0 0 0.24 0" />
				<feBlend in2="BackgroundImageFix" mode="multiply" result="effect1_dropShadow" />
				<feBlend in="SourceGraphic" in2="effect1_dropShadow" mode="normal" result="shape" />
			</filter>
		</defs>
	</svg>
);

export default PanelIcon;
