// @flow
import type {Attribute, AttributesMap} from 'store/sources/attributes/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {GroupsAttributeItem} from 'store/sources/attributesData/groupsAttributes/types';
import type {SourceData} from 'src/store/widgets/data/types';
import type {SourcesFiltersMap} from 'store/sources/sourcesFilters/types';

export type ConnectedProps<Config> = {
	attributes: AttributesMap,
	isUserMode: boolean,
	parentProps: Config,
	sources: DataSourceMap,
	sourcesFilters: SourcesFiltersMap
};

export type ConnectedFunctions = {
	fetchAttributes: (classFqn: string) => Promise<Array<Attribute>>,
	fetchGroupsAttributes: (classFqn: string, attrGroupCode: string | null) => Promise<Array<GroupsAttributeItem>>
};

export type Props<Config> = ConnectedProps<Config> & ConnectedFunctions;

export type InjectedProps = {
	fetchFilterAttributes: (source: SourceData) => Promise<void>,
	fetchingFilterAttributes: boolean,
	filterAttributes: Array<Attribute> | null,
	openFilterForm: (source: SourceData) => Promise<string | null>,
	openingFilterForm: boolean,
};

export type State = {
	fetchingFilterAttributes: boolean,
	filterAttributes: Array<Attribute> | null,
	openingFilterForm: boolean,
};
