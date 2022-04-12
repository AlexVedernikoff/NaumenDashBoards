// @flow
import type {InjectOptionsProps} from 'containers/withBaseWidget/types';
import type {SpeedometerWidget} from 'store/widgets/data/types';

export type SpeedometerData = {
	max: number,
	min: number,
	title: string,
	total: number
};

export type Props = InjectOptionsProps & {
	widget: SpeedometerWidget
};
