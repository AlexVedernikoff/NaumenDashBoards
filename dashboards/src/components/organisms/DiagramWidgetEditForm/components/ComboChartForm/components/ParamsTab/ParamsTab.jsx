// @flow
import {CHART_OPTIONS} from './constants';
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {FIELDS} from 'components/organisms/DiagramWidgetEditForm';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import Icon, {ICON_SIZES} from 'components/atoms/Icon';
import MiniSelect from 'components/molecules/MiniSelect';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	handleSelectChartType = (index: number) => (name: string, value: string) => this.props.setDataFieldValue(index, name, value);

	onSelectIndicatorCallback = (index: number) => () => {
		const {setDataFieldValue, values} = this.props;
		const {[FIELDS.yAxis]: indicator} = values.data[index];

		if (indicator) {
			setDataFieldValue(index, FIELDS.yAxisName, getAttributeValue(indicator, 'title'));
		}
	};

	renderChartFieldLabel = (icon: any) => <Icon name={icon} size={ICON_SIZES.LARGE} />;

	renderChartInput = (set: DataSet, index: number) => (
		<div className={styles.chartInput}>
			<MiniSelect
				name={FIELDS.type}
				onSelect={this.handleSelectChartType(index)}
				options={CHART_OPTIONS}
				renderLabel={this.renderChartFieldLabel}
				showCaret={false}
				tip="Тип графика"
				value={set[FIELDS.type]}
			/>
		</div>
	);

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			name: FIELDS.yAxis,
			onSelectCallback: this.onSelectIndicatorCallback,
			renderLeftControl: this.renderChartInput,
			usesEmptyData: true,
			usesTop: true
		};

		return renderIndicatorBoxes(props);
	};

	renderParameterBox = () => {
		const {renderParameterBox} = this.props;
		const props = {
			name: FIELDS.xAxis
		};

		return renderParameterBox(props);
	};

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const sourceRefFields = {
			breakdown: FIELDS.breakdown,
			indicator: FIELDS.yAxis,
			parameter: FIELDS.xAxis,
			yAxisName: FIELDS.yAxisName
		};

		return renderSourceBox(sourceRefFields, 2);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderNavigationBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderParameterBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
