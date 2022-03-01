// @flow
import type {Column, Components, OnClickCell, Row} from 'Table/types';
import type {DefaultTableValue, FontStyle, TextAlign, TextHandler, WidgetTooltip} from 'store/widgets/data/types';
import type {Position} from 'src/components/molecules/WidgetTooltip/components/Message/types.js';
import type {RowAggregation} from 'store/widgets/buildData/types';

export type DefaultProps = {|
	children: React$Node,
	className: string,
	defaultValue: DefaultTableValue,
	fontColor: string,
	left: number | null,
	row: Row | null,
	rowAggregations: Array<RowAggregation> | null,
	rowIndex: number,
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
	tooltip?: WidgetTooltip
};

export type State = {
	position: Position | null,
};
