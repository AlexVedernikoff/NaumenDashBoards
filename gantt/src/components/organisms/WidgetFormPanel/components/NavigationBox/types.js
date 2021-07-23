// @flow
import type {NavigationSettings} from 'store/widgets/data/types';
import type {Props as ContainerProps} from 'containers/NavigationBox/types';

export type Props = ContainerProps & {
	name: string,
	onChange: (name: string, settings: NavigationSettings) => void,
	value: NavigationSettings
};
