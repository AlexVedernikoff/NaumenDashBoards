// @flow
import type {ContextProps, ParamsTabProps} from 'DiagramWidgetEditForm/types';
import type {DataSourceMap} from 'store/sources/data/types';
import type {OnChangeInputEvent} from 'components/types';
import type {Props as IndicatorProps} from 'DiagramWidgetEditForm/components/IndicatorDataBox/types';

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

export type IndicatorBoxProps = $Shape<IndicatorProps>;

export type SourceInjectedProps = {|
	renderAddSourceInput: () => React$Node,
	renderSourceFieldset: (sourceRefFields: Object) => (set: Object, index: number) => React$Node,
	...Object
|};

export type RenderSourceFieldsetProps = $Shape<{
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
	renderNavigationBox: () => React$Node,
	renderParameterBox: () => React$Node,
	renderShowEmptyDataCheckbox: () => React$Node,
	renderSourceBox: () => React$Node
};

export type Props = {
	render: (props: DataBuilderProps) => React$Node,
	...ParamsTabProps,
	...ContextProps,
	...SourceInjectedProps
};
