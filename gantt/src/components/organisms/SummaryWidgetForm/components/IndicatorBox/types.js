// @flow
import type {SummaryIndicator} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: SummaryIndicator) => void,
	useAutoFontSize: boolean,
	value: SummaryIndicator
};
