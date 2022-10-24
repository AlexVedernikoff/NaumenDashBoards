// @flow
import type {OnChange, Values} from 'components/organisms/SummaryWidgetForm/types';
import type {SourcesFiltersMap} from 'store/sources/sourcesFilters/types';

export type FilterDescriptorGetter = (source: string, filterId: string) => string;

export type OwnProps = {
	onChange: OnChange,
	values: Values
};

export type ConnectedProps = {
	filters: SourcesFiltersMap
};

export type ComponentProps = OwnProps & {
	onCheckAllowComparePeriod: () => void,
};

export type Props = ConnectedProps & OwnProps;
