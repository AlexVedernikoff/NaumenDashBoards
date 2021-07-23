// @flow
import type {ControlType} from 'components/organisms/AttributeCreatingModal/types';

export type Props = {
	index: number,
	name: string,
	onCancel: (index: number, name: string) => void,
	onSubmit: (index: number, name: string, value: number, type: ControlType) => void,
	type: ControlType,
	value: string | null
};

export type State = {
	showForm: boolean,
	value: string
};
