// @flow
import Component from 'GroupModal/components/CustomGroup';
import type {CustomGroup} from 'store/customGroups/types';
import type {Props as ComponentProps} from 'GroupModal/components/CustomGroup/types';
import type {Ref} from 'components/types';
import type {ThunkAction} from 'store/types';
import type {Widget} from 'store/widgets/data/types';

export type ConnectedProps = {
	loading: boolean,
	widgets: Array<Widget>
};

export type ConnectedFunctions = {
	onCreate: (group: CustomGroup) => any,
	onFetch: () => ThunkAction,
	onRemove: (id: string) => ThunkAction,
	onUpdate: (group: CustomGroup) => ThunkAction
};

export type Props = ComponentProps & ConnectedProps & ConnectedFunctions & {
	forwardedRef: Ref<typeof Component>
};
