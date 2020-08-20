// @flow
import {FONT_FAMILIES, TEXT_ALIGNS, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {Header} from 'store/widgets/data/types';

const DEFAULT_HEADER_SETTINGS: Header = {
	fontColor: '#323232',
	fontFamily: FONT_FAMILIES[0],
	fontSize: 16,
	fontStyle: undefined,
	name: '',
	show: true,
	template: '',
	textAlign: TEXT_ALIGNS.left,
	textHandler: TEXT_HANDLERS.CROP,
	useName: true
};

const PADDING = 16;

export {
	DEFAULT_HEADER_SETTINGS,
	PADDING
};
