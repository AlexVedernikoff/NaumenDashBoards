// @flow
import type {Props as ComponentProps} from 'components/templates/WidgetForm/types';

export type Tab = {
	key: string,
	title: string
};

export type ChildrenFN = (activeTab: string) => React$Node;

export type Props = {
	...ComponentProps,
	children: ChildrenFN,
	tabs: Array<Tab>
};

export type State = {
	activeTab: string
};
