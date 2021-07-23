// @flow
import type {NumberAxisFormat} from 'store/widgets/data/types';
import type {Props as ParentProps} from 'components/molecules/ParameterFormatPanel/types';

export type Props = {
	...ParentProps,
	showSymbolCount: boolean,
	value: NumberAxisFormat
};
