// @flow
import {CHART_OPTIONS} from './constants';
import {COMBO_TYPES} from 'store/widgets/data/constants';
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import type {DataSet} from 'containers/DiagramWidgetEditForm/types';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import Icon from 'components/atoms/Icon';
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

	renderChartFieldLabel = (icon: any) => <Icon height={24} name={icon} viewBox="0 0 24 24" width={24} />;

	renderChartInput = (dataSet: DataSet, index: number) => {
		const {type: value = COMBO_TYPES.COLUMN} = dataSet;

		return (
			<div className={styles.chartInput}>
				<MiniSelect
					name={FIELDS.type}
					onSelect={this.handleSelectChartType(index)}
					options={CHART_OPTIONS}
					renderLabel={this.renderChartFieldLabel}
					showCaret={false}
					tip="Тип графика"
					value={value}
				/>
			</div>
		);
	};

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			onSelectCallback: this.onSelectIndicatorCallback,
			renderLeftControl: this.renderChartInput,
			usesBlankData: true,
			usesEmptyData: true,
			usesTop: true
		};

		return renderIndicatorBoxes(props);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderNavigationBox, renderParameterBox, renderSourceBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{renderSourceBox()}
				{renderParameterBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
