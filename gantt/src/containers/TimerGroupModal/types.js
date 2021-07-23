// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Group} from 'store/widgets/data/types';
import type {Option} from 'GroupModal/types';
import type {TimerCustomGroup} from 'store/customGroups/types';

export type ConnectedProps = {
	customGroups: Array<TimerCustomGroup>
};

export type Props = ConnectedProps & {
	attribute: Attribute,
	onClose: () => void,
	onSubmit: (value: Group, attribute: Attribute) => void,
	value: Group
};

export type State = {
	orConditionOptions: Array<Option>,
	statusOptions: Array<Option>
};
