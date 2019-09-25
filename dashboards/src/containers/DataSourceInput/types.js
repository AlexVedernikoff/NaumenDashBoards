// @flow
import type {AttributeMap} from 'store/sources/attributes/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	attributes: AttributeMap,
	dataSources: DataSourceMap
};

export type ConnectedFunctions = {
	fetchDataSources: (fqn: string) => ThunkAction
};

type ReceivedProps = {
	onChange: (SelectValue) => void,
	value: SelectValue
}

export type Props = ReceivedProps & ConnectedProps & ConnectedFunctions;
