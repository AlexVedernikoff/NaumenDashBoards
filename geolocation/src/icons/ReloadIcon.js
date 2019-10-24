// @flow
import React from 'react';

const ReloadIcon = ({color}: Object) => (
	<div>
		<svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
			<g filter="url(#filter0_d)">
				<path d="M8 8c0-1.1.9-2 2-2h28a2 2 0 012 2v28a2 2 0 01-2 2H10a2 2 0 01-2-2V8z" fill="#fff"/>
			</g>
			<rect x="12" y="10" width="24" height="24" rx="2" fill={color}/>
			<path d="M27.53 18.47a5 5 0 101.3 4.78h-1.3a3.75 3.75 0 11-.89-3.89L25 21h4v-4l-1.47 1.47z" fill="#323232"/>
			<defs>
				<filter id="filter0_d" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix"/>
					<feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
					<feOffset dy="2"/>
					<feGaussianBlur stdDeviation="4"/>
					<feColorMatrix values="0 0 0 0 0.504 0 0 0 0 0.574475 0 0 0 0 0.63 0 0 0 0.5 0"/>
					<feBlend mode="multiply" in2="BackgroundImageFix" result="effect1_dropShadow"/>
					<feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
				</filter>
			</defs>
		</svg>
	</div>
);

export default ReloadIcon;
