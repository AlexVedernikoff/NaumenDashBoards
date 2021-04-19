// @flow
import {connect} from 'react-redux';
import ControlPanel from 'components/organisms/DiagramWidget/components/ControlPanel';
import {functions} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class ControlPanelContainer extends PureComponent<Props> {
	handleChangeFilter = async (dataSetIndex: number, filterIndex: number, newDescriptor: string) => {
		// $FlowFixMe
		const {onSaveWidgetWithNewFilters, widget} = this.props;
		const newData = widget.data.map((dataSet, index) => {
			let newDataSet = dataSet;

			if (index === dataSetIndex) {
				const {source} = newDataSet;
				const {widgetFilterOptions} = source;

				if (widgetFilterOptions) {
					const newFilterOptions = widgetFilterOptions.map((filter, i) => {
						return i === filterIndex ? ({...filter, descriptor: newDescriptor}) : filter;
					});

					newDataSet = {
						...newDataSet,
						source: {
							...source,
							widgetFilterOptions: newFilterOptions
						}
					};
				}
			}

			return newDataSet;
		});

		onSaveWidgetWithNewFilters({...widget, data: newData});
	};

	handleClearFilters = () => {
		// $FlowFixMe
		const {onSaveWidgetWithNewFilters, widget} = this.props;

		const newData = widget.data.map(dataSet => {
			const {source} = dataSet;
			const {widgetFilterOptions} = dataSet.source;
			let newDataSet = dataSet;

			if (widgetFilterOptions) {
				const newFilterOptions = widgetFilterOptions.map(filter => ({...filter, descriptor: ''}));

				newDataSet = {
					...dataSet,
					source: {
						...source,
						widgetFilterOptions: newFilterOptions
					}
				};
			}

			return newDataSet;
		});

		onSaveWidgetWithNewFilters({...widget, data: newData});
	};

	render () {
		return (
			<ControlPanel
				{...this.props}
				onChangeFilter={this.handleChangeFilter}
				onClearFilters={this.handleClearFilters}
			/>
		);
	}
}

export default connect(null, functions)(ControlPanelContainer);
