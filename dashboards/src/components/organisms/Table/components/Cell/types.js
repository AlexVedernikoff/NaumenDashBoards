// @flow
import type {Column, Components, OnClickCell, Row} from 'Table/types';
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler, WidgetTooltip} from 'store/widgets/data/types';
import type {SingleRowInfo} from 'store/widgets/buildData/types';

export type DefaultProps = {|
	children: React$Node,
	className: string,
	defaultValue: DefaultTableValue,
	fontColor: string,
	left: number | null,
	row: Row | null,
	rowIndex: number,
	rowsInfo: Array<SingleRowInfo> | null,
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
	onClick?: OnClickCell,
	tooltip?: WidgetTooltip | null,
};
