// @flow
import type {Components, OnClickDataCell} from 'Table/types';
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler} from 'store/widgets/data/types';

export type DefaultProps = {|
	body: boolean,
	children: React$Node,
	className: string,
	defaultValue: DefaultTableValue,
	fontColor: string,
	rowIndex: number,
	textAlign: TextAlign,
	textHandler: TextHandler,
	value: string,
	width: number
|};

export type Props = {
	...DefaultProps,
	columnIndex: number,
	components: Components,
	fontStyle?: FontStyle,
	onClick?: OnClickDataCell
};
