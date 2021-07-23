// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group} from 'store/widgets/data/types';
import type {StringCustomGroup} from 'store/customGroups/types';

export type ConnectedProps = {
	customGroups: Array<StringCustomGroup>
};

export type Props = ConnectedProps & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};
