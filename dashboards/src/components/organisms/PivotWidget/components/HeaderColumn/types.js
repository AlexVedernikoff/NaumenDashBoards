// @flow
import type {PivotColumn} from 'utils/recharts/types';
import type {PivotHeaderSettings} from 'src/store/widgets/data/types';
import type {StringFormatter} from 'utils/recharts/formater/types';

export type Props = {
	column: PivotColumn,
	columnsWidth: Array<number>,
	formatter: StringFormatter,
	offset: number,
	onChangeWidth: (offset: number, newWidth: number) => void,
	style: PivotHeaderSettings;
};

export type State = {
	columnWidth: number,
	columnWidths: Array<number>,
};

export type HeaderColumnStyle = {
	width: string
};

export type TitleColumnStyle = {
	color: string,
	fontStyle: string,
	fontWeight: string,
	height: string,
	textDecoration: string,
};
