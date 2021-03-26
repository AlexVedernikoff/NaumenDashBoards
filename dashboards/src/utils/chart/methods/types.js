// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {DrillDownMixin} from 'store/widgets/links/types';
import type {Group} from 'store/widgets/data/types';

export type AddFiltersProps = {
	buildData: DiagramBuildData,
	config: Object,
	mixin: DrillDownMixin
};

export type AddFilterProps = {
	attribute?: Attribute,
	group?: Group,
	value: string
};

export type ReturnsAddFiltersData = [number, DrillDownMixin];
