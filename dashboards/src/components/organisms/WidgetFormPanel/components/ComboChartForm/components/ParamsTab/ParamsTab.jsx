// @flow
import {CHART_OPTIONS} from './constants';
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import Icon, {ICON_SIZES} from 'components/atoms/Icon';
import {MiniSelect} from 'components/molecules';
import React, {Component, Fragment} from 'react';
import styles from './styles.less';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	handleSelectChartType = (index: number) => (name: string, value: string) => this.props.setDataFieldValue(index, name, value);

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
			renderLeftControl: this.renderChartInput
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
		const props = {
			minCountBuildingSources: 2,
			parameterName: FIELDS.xAxis,
			sourceRefFields: this.sourceRefFields
		};

		return renderSourceBox(props);
	};

	render () {
		const {renderBaseBoxes} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderParameterBox()}
				{this.renderIndicatorBoxes()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
