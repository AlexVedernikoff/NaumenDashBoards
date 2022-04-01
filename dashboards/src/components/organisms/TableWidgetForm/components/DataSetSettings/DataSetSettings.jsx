// @flow
import type {Components, Props} from './types';
import type {Indicator, Parameter} from 'store/widgetForms/types';
import IndicatorsBox from 'TableWidgetForm/components/IndicatorsBox';
import memoize from 'memoize-one';
import ParametersBox from 'TableWidgetForm/components/ParametersBox';
import {PARENT_CLASS_FQN_CONTEXT} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withParentClassFqn';
import React, {PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';

export class DataSetSettings extends PureComponent<Props> {
	getIndicatorsBoxComponents = memoize(({IndicatorsFormBox}: Components) => ({
		FormBox: IndicatorsFormBox
	}));

	getDataSetSources = () => {
		const {fetchLinkedDataSources, isMain, linkedSources, parentClassFqn, sources: mainSources} = this.props;
		let sources = mainSources;

		if (!isMain) {
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

	handleChangeIndicators = (index: number, indicators: Array<Indicator>, callback?: Function) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, indicators}, callback);
	};

	handleChangeParameters = (index: number, parameters: Array<Parameter>, callback?: Function) => {
		const {onChange, value} = this.props;
		return onChange(index, {...value, parameters}, callback);
	};

	renderIndicatorsBox = () => {
		const {components, index, value} = this.props;

		if (!value.sourceForCompute) {
			const {dataKey, indicators, source} = value;

			return (
				<IndicatorsBox
					canAddIndicators={true}
					canCreateInterestRelative={false}
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
					usesFilter={isMain}
					value={value}
				/>
			</SourceBox>
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
