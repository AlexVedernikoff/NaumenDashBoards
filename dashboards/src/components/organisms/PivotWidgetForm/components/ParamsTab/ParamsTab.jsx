// @flow
import {createPivotDataSet} from 'store/widgetForms/pivotForm/helpers';
import type {DataSet} from 'store/widgetForms/pivotForm/types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import {getUnusedIndicators, getValuesDataUpdate} from './helpers';
import IndicatorsDataBox from 'PivotWidgetForm/components/IndicatorsDataBox';
import IndicatorsGroupBox from 'PivotWidgetForm/components/IndicatorsGroupBox';
import NavigationBox from 'containers/NavigationBox';
import type {ParameterOrder} from 'store/widgetForms/types';
import ParametersDataBox from 'PivotWidgetForm/components/ParametersDataBox';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import SourceLinksBox from 'containers/SourceLinksBox';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

export class ParamsTab extends Component<Props> {
	filterByDataSet = (callback?: Function) => {
		const {onChange, values} = this.props;
		const {indicatorGrouping, links, parametersOrder} = getValuesDataUpdate(values);

		onChange(DIAGRAM_FIELDS.indicatorGrouping, indicatorGrouping, () => {
			onChange(DIAGRAM_FIELDS.links, links, () => {
				onChange(DIAGRAM_FIELDS.parametersOrder, parametersOrder, callback);
			});
		});
	};

	handleAddDataSet = () => {
		const {onChange, values} = this.props;
		return onChange(DIAGRAM_FIELDS.data, [...values.data, createPivotDataSet(uuid())]);
	};

	handleChangeDataSet = (index: number, newDataSet: DataSet, callback?: Function) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData, callback);
	};

	handleChangeIndicators = (data: Array<DataSet>) => {
		const {onChange} = this.props;

		onChange(DIAGRAM_FIELDS.data, data, this.updateIndicators);
	};

	handleChangeIndicatorsGroupBox = value => {
		const {onChange} = this.props;
		return onChange(DIAGRAM_FIELDS.indicatorGrouping, value);
	};

	handleChangeLinks = links => {
		const {onChange} = this.props;
		return onChange(DIAGRAM_FIELDS.links, links);
	};

	handleChangeParameters = (parametersOrder: Array<ParameterOrder>) => {
		const {onChange} = this.props;

		this.updateParametersDataSet(parametersOrder, () => {
			onChange(DIAGRAM_FIELDS.parametersOrder, parametersOrder);
		});
	};

	handleChangeShowTotalAmount = (value: boolean) => {
		const {onChange} = this.props;
		return onChange(DIAGRAM_FIELDS.showTotalAmount, value);
	};

	handleChangeShowTotalRowAmount = (value: boolean) => {
		const {onChange} = this.props;
		return onChange(DIAGRAM_FIELDS.showTotalRowAmount, value);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		if (data.length > 1) {
			onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index), this.filterByDataSet);
		}
	};

	updateIndicators = () => {
		this.filterByDataSet(() => {
			const {onChange, values} = this.props;
			const {indicatorGrouping} = values;

			if (indicatorGrouping) {
				const unusedIndicators = getUnusedIndicators(values);
				const newIndicatorGrouping = [...indicatorGrouping, ...unusedIndicators];

				onChange(DIAGRAM_FIELDS.indicatorGrouping, newIndicatorGrouping);
			}
		});
	};

	updateParametersDataSet = (parametersOrder: Array<ParameterOrder>, callback?: Function) => {
		const {onChange, values} = this.props;
		const {data} = values;
		const newData = [];

		data.forEach(dataSet => {
			const {dataKey} = dataSet;
			const parameters = parametersOrder
				.filter(item => item.dataKey === dataKey && item.parameter?.attribute)
				.map(item => item.parameter);

			newData.push({...dataSet, parameters});
		});

		onChange(DIAGRAM_FIELDS.data, newData, callback);
	};

	renderSourceFieldset = (dataSet: DataSet, index: number, data: Array<DataSet>) => (
		<SourceFieldset
			autoFillIndicators={false}
			index={index}
			key={`sourceFieldset_${index}`}
			onChange={this.handleChangeDataSet}
			onRemove={this.handleRemoveDataSet}
			removable={data.length > 1}
			value={dataSet}
		/>
	);

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, indicatorGrouping, links, navigation, parametersOrder, showTotalAmount, showTotalRowAmount} = values;
		const disableShowTotal = values.data.length === 0
			|| (values.data.length === 1 && values.data[0].indicators.length === 0)
			|| (values.data.length === 1 && values.data[0].indicators.length === 1 && !values.data[0].indicators[0].breakdown);

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				<SourceLinksBox data={data} links={links} onChange={this.handleChangeLinks} />
				<ParametersDataBox
					data={data}
					disableShowTotal={disableShowTotal}
					onChange={this.handleChangeParameters}
					onChangeShowTotal={this.handleChangeShowTotalRowAmount}
					showTotal={showTotalRowAmount}
					value={parametersOrder}
				/>
				<IndicatorsDataBox
					data={data}
					onChange={this.handleChangeIndicators}
					onChangeShowTotal={this.handleChangeShowTotalAmount}
					showTotal={showTotalAmount}
				/>
				<IndicatorsGroupBox data={data} onChange={this.handleChangeIndicatorsGroupBox} value={indicatorGrouping} />
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
