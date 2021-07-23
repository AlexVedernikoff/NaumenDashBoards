// @flow
import Component from 'GroupModal/components/CustomGroup';
import type {CustomGroup} from 'store/customGroups/types';
import type {Props as ComponentProps} from 'GroupModal/components/CustomGroup/types';
import type {Ref} from 'components/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	group: CustomGroup,
	loading: boolean,
	loadingOptions: boolean,
	widgets: Array<Widget>
};

export type ConnectedFunctions = {
	onClearUnnamed: () => ThunkAction,
	onCreate: (group: CustomGroup) => ThunkAction,
	onFetch: (id: string) => ThunkAction,
	onFetchOptions: () => ThunkAction,
	onRemove: (id: string) => ThunkAction,
	onUpdate: (group: CustomGroup) => ThunkAction
};

export type Props = ConnectedProps & ConnectedFunctions & {
	...ComponentProps,
	forwardedRef: Ref<typeof Component>,
	value: string
};
