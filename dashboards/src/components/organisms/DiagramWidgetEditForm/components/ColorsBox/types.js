// @flow
import type {ChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	disabledCustomSettings: boolean,
	labels?: Array<string>,
	name: string,
	onChange: (name: string, value: any) => void,
	value: ChartColorsSettings
};
