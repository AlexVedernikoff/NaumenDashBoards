// @flow
import type {ContextProps, OrCondition} from 'CustomGroup/types';

export type Props = {
	...ContextProps,
	condition: OrCondition,
	disabled: boolean,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, condition: OrCondition) => void,
	validationPath: string
};
