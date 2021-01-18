// @flow
import type {Column, Components, OnClickCell, Row} from 'Table/types';
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler} from 'store/widgets/data/types';

export type DefaultProps = {|
	children: React$Node,
	className: string,
	defaultValue: DefaultTableValue,
	fontColor: string,
	left: number,
	row: Row | null,
	textAlign: TextAlign,
	textHandler: TextHandler,
	tip: string,
	value: string,
	width: number | string
|};

export type Props = {
	...DefaultProps,
	column: Column,
	components: Components,
	fontStyle?: FontStyle,
	last: boolean,
	onClick?: OnClickCell
};
