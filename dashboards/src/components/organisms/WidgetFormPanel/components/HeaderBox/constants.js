// @flow
import {HEADER_POSITIONS} from 'store/widgets/data/constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {PositionOption} from './types';

const POSITION_OPTIONS: Array<PositionOption> = [
	{
		name: ICON_NAMES.POSITION_TOP,
		title: 'HeaderBox::PositionTop',
		value: HEADER_POSITIONS.TOP
	},
	{
		name: ICON_NAMES.POSITION_BOTTOM,
		title: 'HeaderBox::PositionBottom',
		value: HEADER_POSITIONS.BOTTOM
	}
];

export {
	POSITION_OPTIONS
};
