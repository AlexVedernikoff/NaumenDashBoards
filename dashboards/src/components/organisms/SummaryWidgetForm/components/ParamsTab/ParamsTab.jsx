// @flow
import {createSummaryDataSet} from 'store/widgetForms/summaryForm/helpers';
import type {DataSet} from 'store/widgetForms/summaryForm/types';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import DisplayModeSelectBox from 'containers/DisplayModeSelectBox';
import type {Indicator} from 'store/widgetForms/types';
import IndicatorsBox from 'WidgetFormPanel/components/IndicatorsBox';
import NavigationBox from 'containers/NavigationBox';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import SourceBox from 'WidgetFormPanel/components/SourceBox';
import SourceFieldset from 'containers/SourceFieldset';
import uuid from 'tiny-uuid';
import WidgetNameBox from 'WidgetFormPanel/components/WidgetNameBox';
import WidgetSelectBox from 'WidgetFormPanel/components/WidgetSelectBox';

export class ParamsTab extends PureComponent<Props> {
	handleAddDataSet = () => {
		const {onChange, values} = this.props;

		onChange(DIAGRAM_FIELDS.data, [...values.data, createSummaryDataSet(uuid())]);
	};

	handleChangeDataSet = (index: number, newDataSet: DataSet) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? newDataSet : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleChangeIndicators = (index: number, indicators: Array<Indicator>) => {
		const {onChange, values} = this.props;
		const newData = values.data.map((dataSet, i) => i === index ? {...dataSet, indicators} : dataSet);

		onChange(DIAGRAM_FIELDS.data, newData);
	};

	handleRemoveDataSet = (index: number) => {
		const {onChange, values} = this.props;
		const {data} = values;

		data.length > 1 && onChange(DIAGRAM_FIELDS.data, data.filter((dataSet, i) => i !== index));
	};

	renderIndicatorsBox = ({dataKey, indicators, source}: DataSet, index: number) => (
		<IndicatorsBox
			dataKey={dataKey}
			index={index}
			key={dataKey}
			onChange={this.handleChangeIndicators}
			source={source}
			value={indicators}
		/>
	);

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
				{data.filter(dataSet => !dataSet.sourceForCompute).map(this.renderIndicatorsBox)}
				<DisplayModeSelectBox name={DIAGRAM_FIELDS.displayMode} onChange={onChange} value={displayMode} />
				<NavigationBox name={DIAGRAM_FIELDS.navigation} onChange={onChange} value={navigation} />
			</Fragment>
		);
	}
}

export default ParamsTab;