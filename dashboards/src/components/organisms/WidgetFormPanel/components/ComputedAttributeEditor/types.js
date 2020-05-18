// @flow
import type {ComputedAttr} from 'store/widgets/data/types';
import type {SourceOption} from 'components/organisms/AttributeCreatingModal/types';

export type Props = {
	onRemove: (id: string) => void,
	onSubmit: (value: ComputedAttr) => void,
	sources: Array<SourceOption>,
	value: ComputedAttr
};

export type State = {
	showModal: boolean
};