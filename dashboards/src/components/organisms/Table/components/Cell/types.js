// @flow
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler} from 'store/widgets/data/types';
import type {RenderValue} from 'Table/types';

export type Props = {
	body: boolean,
	children: React$Node,
	className: string,
	defaultValue: DefaultTableValue,
	fontColor: string,
	fontStyle?: FontStyle,
	onClick?: () => void,
	renderValue?: RenderValue,
	textAlign: TextAlign,
	textHandler: TextHandler,
	value: string,
	width: number
};
