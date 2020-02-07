// @flow
import type {ComputedAttr} from 'components/molecules/AttributeCreatingModal/types';
import type {Option as SourceOption} from 'components/molecules/SourceControl/types';

export type Props = {
	onRemove: (id: string) => void,
	onSubmit: (value: ComputedAttr) => void,
	sources: Array<SourceOption>,
	value: ComputedAttr
};

export type State = {
	showModal: boolean
};
