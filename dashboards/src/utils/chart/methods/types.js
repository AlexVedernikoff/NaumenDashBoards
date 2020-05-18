// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ComputedBreakdown, Group} from 'store/widgets/data/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDownMixin} from 'store/widgets/links/types';

export type AddFiltersProps = {
	buildData: DiagramBuildData,
	config: Object,
	mixin: DrillDownMixin
};

export type AddFilterProps = {
	attribute?: Attribute | ComputedBreakdown | null,
	group?: Group | null,
	mixin: DrillDownMixin,
	value: string | number
};
