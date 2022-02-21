// @flow
import type {Components, Props} from './types';
import FormBox from 'components/molecules/FormBox';
import FormField from 'WidgetFormPanel/components/FormField';
import type {Indicator, Parameter} from 'store/widgetForms/types';
import IndicatorsBox from 'TableWidgetForm/components/IndicatorsBox';
import {isDontUseParamsForDataSet} from 'store/widgetForms/tableForm/helpers';
import memoize from 'memoize-one';
import type {OnChangeEvent} from 'components/types';
import ParametersBox from 'TableWidgetForm/components/ParametersBox';
import {PARENT_CLASS_FQN_CONTEXT} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withParentClassFqn';
import React, {PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import t from 'localization';
import TextInput from 'components/atoms/TextInput';

export class DataSetSettings extends PureComponent<Props> {
	getIndicatorsBoxComponents = memoize(({IndicatorsFormBox}: Components) => ({
		FormBox: IndicatorsFormBox
	}));

	getDataSetSources = () => {
		const {fetchLinkedDataSources, isMain, linkedSources, parentClassFqn, sources: mainSources, value} = this.props;
		const {sourceRowName} = value;
		let sources = mainSources;
		const isSourceRowName = sourceRowName !== null;

		if (!isMain && !isSourceRowName) {
			sources = {};

			if (parentClassFqn) {
				if (linkedSources[parentClassFqn]) {
					sources = linkedSources[parentClassFqn]?.map;
				} else {
					fetchLinkedDataSources(parentClassFqn);
				}
			}
		}

		return sources;
	};

	getHandleChangeSourceRowNameValue = (index: number) => ({value: sourceRowName}: OnChangeEvent<string>) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, sourceRowName});
	};

	handleChangeIndicators = (index: number, indicators: Array<Indicator>, callback?: Function) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, indicators}, callback);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>, callback?: Function) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, parameters}, callback);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>, callback?: Function) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, parameters}, callback);
	};

	renderIndicatorsBox = () => {
		const {components, index, value} = this.props;

		if (!value.sourceForCompute) {
			const {dataKey, indicators, source} = value;
			const canAddIndicators = !isDontUseParamsForDataSet(value);

			return (
				<IndicatorsBox
					canAddIndicators={canAddIndicators}
					components={this.getIndicatorsBoxComponents(components)}
					dataKey={dataKey}
					index={index}
					onChange={this.handleChangeIndicators}
					source={source}
					value={indicators}
				/>
			);
		}

		return null;
	};

	renderParametersBox = () => {
		const {index, value} = this.props;
		const {dataKey, parameters, source} = value;

		if (isDontUseParamsForDataSet(value)) {
			return this.renderSourceRowNameEditor();
		}

		return (
			<ParametersBox
				dataKey={dataKey}
				index={index}
				onChange={this.handleChangeParameters}
				source={source}
				value={parameters}
			/>
		);
	};

	renderSourceBox = () => {
		const {index, isLast, isMain, onAdd, onChange, onRemove, parentClassFqn, value} = this.props;
		const isSingleRow = isDontUseParamsForDataSet(value);

		return (
			<SourceBox onAdd={onAdd}>
				<SourceFieldset
					index={index}
					onChange={onChange}
					onRemove={onRemove}
					parentClassFqn={parentClassFqn}
					removable={!isLast}
					showSourceRowName={true}
					sources={this.getDataSetSources()}
					usesFilter={isMain || isSingleRow}
					value={value}
				/>
			</SourceBox>
		);
	};

	renderSourceRowNameEditor = () => {
		const {index, value: {sourceRowName}} = this.props;

		return (
			<FormBox title={t('TableWidgetForm::ParametersBox::SourceRowName')}>
				<FormField>
					<TextInput
						onChange={this.getHandleChangeSourceRowNameValue(index)}
						placeholder={t('TableWidgetForm::DataSetSettings::SourceRowNamePlaceholder')}
						value={sourceRowName}
					/>
				</FormField>
			</FormBox>
		);
	};

	render () {
		const {parentClassFqn} = this.props;

		return (
			<PARENT_CLASS_FQN_CONTEXT.Provider value={parentClassFqn}>
				{this.renderSourceBox()}
				{this.renderParametersBox()}
				{this.renderIndicatorsBox()}
			</PARENT_CLASS_FQN_CONTEXT.Provider>
		);
	}
}

export default DataSetSettings;
