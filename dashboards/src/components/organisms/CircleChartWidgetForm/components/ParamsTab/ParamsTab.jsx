// @flow
import ChartDataSetSettings from 'WidgetFormPanel/components/ChartDataSetSettings';
import {createCircleDataSet} from 'store/widgetForms/circleChartForm/helpers';
import type {DataSet} from 'store/widgetForms/circleChartForm/types';
import {DEFAULT_INDICATOR} from 'store/widgetForms/constants';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import {GROUP_WAYS} from 'src/store/widgets/constants';
import NavigationBox from 'containers/NavigationBox';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import ShowTotalAmountBox from 'WidgetFormPanel/components/ShowTotalAmountBox';
import {SORTING_VALUES} from 'src/store/widgets/data/constants';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

export class ParamsTab extends PureComponent<Props> {
	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createCircleDataSet(uuid())]);
	};

	handleChangeDataSet = (index: number, newDataSet: DataSet, callback?: Function) => {
		const {onChange, values} = this.props;
		const {data, sorting} = values;
		const newData = data.map((dataSet, i) => i === index ? newDataSet : dataSet);
		const newBreakdownGroup = newData[0].breakdown?.[0]?.group;

		if (newBreakdownGroup && data[0].breakdown?.[0]?.group?.way !== newBreakdownGroup.way) {
			const {DEFAULT, INDICATOR} = SORTING_VALUES;

			if (newBreakdownGroup.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
				onChange(DIAGRAM_FIELDS.sorting, {...sorting, value: DEFAULT});
			} else if (sorting.value === DEFAULT) {
				onChange(DIAGRAM_FIELDS.sorting, {...sorting, value: INDICATOR});
			}
		}

		newData.forEach(dataSet => {
			if (dataSet.sourceForCompute) {
				dataSet.indicators = [];
				dataSet.breakdown = [];
			}

			if (!dataSet.sourceForCompute && (!dataSet.indicators || dataSet.indicators.length === 0)) {
				dataSet.indicators = [DEFAULT_INDICATOR];
			}
		});

		onChange(DIAGRAM_FIELDS.data, newData, callback);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	renderIndicatorBox = (dataSet: DataSet, index: number) => {
		const {values} = this.props;

		if (!dataSet.sourceForCompute) {
			const hasCustomGroup = !!(values.data[0].breakdown?.[0]?.group?.way === GROUP_WAYS.CUSTOM);

			return (
				<ChartDataSetSettings
					index={index}
					key={`IndicatorBox_${dataSet.dataKey}` }
					onChange={this.handleChangeDataSet}
					requiredBreakdown={true}
					usesBlankData={!hasCustomGroup}
					usesEmptyData={hasCustomGroup}
					value={dataSet}
				/>
			);
		}

		return null;
	};

	renderSourceFieldset = (dataSet: DataSet, index: number, data: Array<DataSet>) => (
		<SourceFieldset
			index={index}
			key={`SourceFieldset_${dataSet.dataKey}` }
			onChange={this.handleChangeDataSet}
			onRemove={this.handleRemoveDataSet}
			removable={data.length > 1}
			value={dataSet}
		/>
	);

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation, showTotalAmount} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				{data.map(this.renderIndicatorBox)}
				<ShowTotalAmountBox onChange={onChange} showTotalAmount={showTotalAmount} />
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
