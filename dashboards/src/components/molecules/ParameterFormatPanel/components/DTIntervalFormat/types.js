// @flow
import type {DTIntervalAxisFormat} from 'store/widgets/data/types';
import type {Props as ParentProps} from 'components/molecules/ParameterFormatPanel/types';

export type Props = {
	...ParentProps,
	value: DTIntervalAxisFormat
};
