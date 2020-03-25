// @flow
import type {Attribute, AttributeMap} from 'store/sources/attributes/types';
import type {Context} from 'utils/api/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {ThunkAction} from 'store/types';
import type {UserData} from 'store/context/types';

export type Props = {
	attributes: AttributeMap,
	cancelForm: () => ThunkAction,
	context: Context,
	errors: Object,
	fetchAttributes: (classFqn: string) => ThunkAction,
	fetchRefAttributes: (refAttr: Attribute, callback: Function) => ThunkAction,
	onSubmit: () => Promise<void>,
	personalDashboard: boolean,
	refAttributes: AttributeMap,
	setDataFieldValue: (index: number) => Function,
	setDataFieldValues: (index: number) => Function,
	setFieldValue: (name: string, value: any) => void,
	sources: DataSourceMap,
	updating: boolean,
	user: UserData,
	values: Object
};

export type State = {
	currentTab: string
};

export type TabParams = {
	key: string,
	title: string
};

export type WrappedProps = {
	[string]: any
};
