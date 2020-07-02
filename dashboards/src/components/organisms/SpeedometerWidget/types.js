// @flow
import type {SpeedometerWidget} from 'store/widgets/data/types';

type SpeedometerData = {
	title: string,
	total: number
};

export type Props = {
	data: SpeedometerData,
	widget: SpeedometerWidget
};
