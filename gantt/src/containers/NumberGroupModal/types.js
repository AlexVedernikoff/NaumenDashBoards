// @flow
import type {Attribute} from 'src/store/sources/attributes/types';
import type {Group} from 'src/store/widgets/data/types';
import type {NumberCustomGroup} from 'src/store/customGroups/types';

export type ConnectedProps = {
	customGroups: Array<NumberCustomGroup>
};

export type Props = ConnectedProps & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};
