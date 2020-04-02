// @flow
import type {ContextProps, SubGroup} from 'CustomGroup/types';

export type Props = {
	...ContextProps,
	onUpdate: (subGroups: Array<SubGroup>) => void,
	subGroups: Array<SubGroup>
};
