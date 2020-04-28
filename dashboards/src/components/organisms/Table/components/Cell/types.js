// @flow
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler} from 'store/widgets/data/types';

export type Props = {
	body: boolean,
	children: React$Node,
	className: string,
	defaultValue: DefaultTableValue,
	fontColor: string,
	fontStyle?: FontStyle,
	onClick?: () => void,
	textAlign: TextAlign,
	textHandler: TextHandler,
	value: string,
	width: number
};
