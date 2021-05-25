// @flow
import React from 'react';

const ReloadIcon = ({color}: Object) => (
	<svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
		<g filter="url(#filter0_d)">
			<rect x="8" y="6" width="36" height="36" rx="4" fill="white"/>
		</g>
		<rect x="12" y="10" width="28" height="28" rx="2" fill={color}/>
		<path d="M29.5327 20.4699C28.7548 19.6888 27.7407 19.1871 26.6483 19.0429C25.5559 18.8987 24.4466 19.1201 23.4929 19.6726C22.5393 20.225 21.7949 21.0776 21.3757 22.0976C20.9565 23.1175 20.8859 24.2476 21.175 25.3119C21.4641 26.3761 22.0966 27.3148 22.9741 27.9819C23.8515 28.6489 24.9247 29.0068 26.0265 28.9999C27.1284 28.993 28.197 28.6216 29.066 27.9436C29.935 27.2655 30.5557 26.3189 30.8314 25.2511H29.5327C29.3037 25.8995 28.901 26.4723 28.3686 26.907C27.8362 27.3417 27.1947 27.6214 26.5142 27.7157C25.8337 27.81 25.1404 27.7152 24.5101 27.4416C23.8798 27.168 23.3368 26.7262 22.9404 26.1644C22.5441 25.6027 22.3097 24.9427 22.2629 24.2567C22.2161 23.5706 22.3586 22.8848 22.675 22.2744C22.9913 21.664 23.4693 21.1524 24.0566 20.7955C24.6438 20.4387 25.3178 20.2503 26.0048 20.2511C26.4959 20.2518 26.9819 20.3505 27.4344 20.5415C27.8868 20.7325 28.2966 21.012 28.6398 21.3636L27 23H31V19.0011L29.5327 20.4699Z" fill="#5F5F5F"/>
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
