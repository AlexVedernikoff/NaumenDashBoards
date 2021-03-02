// @flow
import type {BuildData} from 'store/widgets/buildData/types';
import type {ChartColorsSettings} from 'store/widgets/data/types';

export type Props = {
	buildData: BuildData,
	disabledCustomSettings: boolean,
	name: string,
	onChange: (name: string, value: any) => void,
	value: ChartColorsSettings
};
