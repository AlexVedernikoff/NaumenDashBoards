// @flow
import type {ContextProps, ParamsTabProps} from 'DiagramWidgetEditForm/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {OnChangeInputEvent} from 'components/types';

export type SourceRefFields = $Shape<{
	breakdown: string,
	indicator: string,
	parameter: string
}>;

export type TextAreaProps = {
	className?: string,
	errorPath?: string,
	handleBlur?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
	handleChange: OnChangeInputEvent => void,
	label: string,
	maxLength?: number,
	name: string,
	placeholder?: string,
	value: string
};

export type CheckboxProps = {
	label: string,
	name: string,
	onChange: OnChangeInputEvent => void,
	value: boolean,
};

export type IndicatorBoxProps = $Shape<{|
	children: React$Node,
	name: string,
	renderLeftControl: (set: DataSet, index: number) => React$Node,
	useBreakdown?: boolean
|}>;

export type ParameterBoxProps = $Shape<{|
	children: React$Node,
	name: string,
	useGroup: boolean
|}>;

export type SourceInjectedProps = {|
	renderAddSourceInput: () => React$Node,
	renderSourceFieldset: (sourceRefFields: Object) => (set: Object, index: number) => React$Node,
	...Object
|};

export type RenderSourceFieldsetProps = $Shape<{
	onSelectCallback: (index: number, sourceRefFields: SourceRefFields) => Function,
	sourceRefFields: SourceRefFields,
	sources: DataSourceMap,
	usesFilter: boolean
}>;

export type DataBuilderProps = {
	...ParamsTabProps,
	...ContextProps,
	...SourceInjectedProps,
	renderBaseBoxes: () => React$Node,
	renderDisplayModeSelect: () => React$Node,
	renderIndicatorBoxes: (props?: IndicatorBoxProps) => React$Node,
	renderParameterBox: (props: ParameterBoxProps) => React$Node,
	renderShowEmptyDataCheckbox: () => React$Node,
	renderSourceBox: (sourceRefFields: SourceRefFields, minCountBuildingSources?: number) => React$Node
};

export type Props = {
	render: (props: DataBuilderProps) => React$Node,
	...ParamsTabProps,
	...ContextProps,
	...SourceInjectedProps
};
