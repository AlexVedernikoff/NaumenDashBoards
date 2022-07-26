// @flow
import type {IndicatorGrouping} from 'store/widgets/data/types';

export type State = {
	value: IndicatorGrouping
};

export type Props = {
	onChange: (value: IndicatorGrouping) => void,
	onClose: () => void,
	onSave: (value: IndicatorGrouping) => void,
	value: IndicatorGrouping
};
