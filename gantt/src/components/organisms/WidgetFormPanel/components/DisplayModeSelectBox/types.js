// @flow
import type {DisplayMode} from 'store/widgets/data/types';
import type {Props as ContainerProps} from 'containers/DisplayModeSelectBox/types';

export type Props = ContainerProps & {
	name: string,
	onChange: (name: string, value: DisplayMode) => void,
	value: DisplayMode
};

type StateValue = {
	label: string,
	value: DisplayMode
};

export type State = {
	value: StateValue
};
