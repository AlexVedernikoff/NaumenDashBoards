// @flow
import type {IndicatorGrouping} from 'store/widgets/data/types';

export type Props = {
	onChange: (value: IndicatorGrouping) => void,
	onClose: () => void,
	onSave: () => void,
	value: IndicatorGrouping
};
