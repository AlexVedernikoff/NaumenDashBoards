// @flow
import type {TableCellSettings} from 'store/widgets/data/types';

export type Props = {
	label: string,
	name: string,
	onChange: (name: string, value: TableCellSettings) => void,
	value: TableCellSettings
};
