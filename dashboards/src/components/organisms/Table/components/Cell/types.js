// @flow
import type {Column, OnClickCell, Row} from 'Table/types';
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler} from 'store/widgets/data/types';

export type ValueProps = {
	value: string | number
};

export type Components = {
	Value: React$ComponentType<ValueProps>
};

export type DefaultProps = {|
	children: React$Node,
	className: string,
	components?: Components,
	defaultValue: DefaultTableValue,
	fontColor: string,
	row: Row | null,
	textAlign: TextAlign,
	textHandler: TextHandler,
	tip: string,
	value: string | number,
	width: number | null
|};

export type Props = {
	...DefaultProps,
	column: Column,
	fontStyle?: FontStyle,
	onClick?: OnClickCell
};
