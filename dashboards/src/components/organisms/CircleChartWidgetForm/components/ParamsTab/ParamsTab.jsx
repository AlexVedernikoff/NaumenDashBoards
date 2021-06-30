// @flow
import {createCircleDataSet} from 'store/widgetForms/circleChartForm/helpers';
import type {DataSet} from 'store/widgetForms/circleChartForm/types';
import DataSetSettings from 'WidgetFormPanel/components/ChartDataSetSettings';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import {GROUP_WAYS} from 'src/store/widgets/constants';
import NavigationBox from 'containers/NavigationBox';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
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

	handleChangeDataSet = (index: number, newDataSet: DataSet) => {
		const {onChange, values} = this.props;
		const {data, sorting} = values;
		const newData = data.map((dataSet, i) => i === index ? newDataSet : dataSet);
		const newBreakdownGroup = newData[0].breakdown[0].group;

		if (data[0].breakdown?.[0]?.group?.way !== newBreakdownGroup.way) {
			const {DEFAULT, INDICATOR} = SORTING_VALUES;

			if (newBreakdownGroup.way === GROUP_WAYS.CUSTOM && sorting.value !== DEFAULT) {
				onChange(DIAGRAM_FIELDS.sorting, {...sorting, value: DEFAULT});
			} else if (sorting.value === DEFAULT) {
				onChange(DIAGRAM_FIELDS.sorting, {...sorting, value: INDICATOR});
			}
		}

		onChange(DIAGRAM_FIELDS.data, newData);
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
				<DataSetSettings
					index={index}
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
			onChange={this.handleChangeDataSet}
			onRemove={this.handleRemoveDataSet}
			removable={data.length > 1}
			value={dataSet}
		/>
	);

	render () {
		const {onChange, values} = this.props;
		const {data, displayMode, navigation} = values;

		return (
			<Fragment>
				<WidgetNameBox onChange={onChange} values={values} />
				<WidgetSelectBox />
				<SourceBox onAdd={this.handleAddDataSet}>{data.map(this.renderSourceFieldset)}</SourceBox>
				{data.map(this.renderIndicatorBox)}
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;
