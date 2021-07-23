// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CustomGroup} from 'store/customGroups/types';
import type {Group, Source} from 'store/widgets/data/types';

export type Props = {
	attribute: Attribute | null,
	disabled: boolean,
	getCustomGroup: (customGroupId: string) => Promise<CustomGroup | null>,
	onChange: (value: Group, attribute: Attribute) => void,
	source: Source | null,
	value: Group | string | null
};

export type State = {
	attribute: Attribute | null,
	groupAttribute: Attribute | null,
	showModal: boolean
};
