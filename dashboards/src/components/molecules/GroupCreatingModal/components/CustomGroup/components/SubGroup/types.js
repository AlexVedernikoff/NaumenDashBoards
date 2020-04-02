// @flow
import type {ContextProps, SubGroup} from 'CustomGroup/types';

export type Props = {
	...ContextProps,
	index: number,
	isLast: boolean,
	onRemove: (index: number) => void,
	onUpdate: (index: number, subGroup: SubGroup) => void,
	subGroup: SubGroup,
	validationPath: string
};
