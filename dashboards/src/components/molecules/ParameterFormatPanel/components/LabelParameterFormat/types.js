// @flow
import type {LabelAxisFormat} from 'store/widgets/data/types';
import type {Props as ParentProps} from 'components/molecules/ParameterFormatPanel/types';

export type Props = {
	...ParentProps,
	label: ?string,
	value: LabelAxisFormat
};
