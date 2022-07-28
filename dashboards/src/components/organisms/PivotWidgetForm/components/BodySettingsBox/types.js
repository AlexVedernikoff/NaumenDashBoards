// @flow
import type {PivotBodySettings} from 'src/store/widgets/data/types';

export type Props = {
	onChange: (value: PivotBodySettings) => void,
	value: PivotBodySettings
};
