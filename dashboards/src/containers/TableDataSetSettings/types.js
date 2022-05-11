// @flow
import type {DataSourceMap} from 'store/sources/data/types';
import type {LinkedDataSourceMap} from 'store/sources/linkedData/types';
import type {Props as ComponentProps} from 'TableWidgetForm/components/DataSetSettings/types';
import type {ThunkAction} from 'store/types';

export type ConnectedProps = {
	isUserMode: boolean,
	linkedSources: LinkedDataSourceMap,
	sources: DataSourceMap
};

export type FetchLinkedDataSources = (classFqn: string) => ThunkAction;

export type ConnectedFunctions = {
	fetchLinkedDataSources: FetchLinkedDataSources,
};

export type Props = ConnectedProps & ConnectedFunctions & ComponentProps;
