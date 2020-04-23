// @flow
import {ATTRIBUTE_SETS} from 'store/sources/attributes/constants';
import {CHART_OPTIONS} from './constants';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {FormBox, MiniSelect} from 'components/molecules';
import React, {Fragment} from 'react';
import styles from './styles.less';

export class ParamsTab extends DataFormBuilder {
	minCountBuildingSources = 2;
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	changeDependingOnMain = (index: number) => {
		const {setDataFieldValue} = this.props;
		const {dataKey: currentKey, source: currentSource, xAxis: currentXAxis} = this.getSet(index);
		const {dataKey: mainKey, source: mainSource, xAxis: mainXAxis} = this.getMainSet();

		if (currentKey !== mainKey && mainSource && currentSource) {
			if (mainSource.value === currentSource.value) {
				this.setMainValue(index, FIELDS.xAxis, FIELDS.group);
			} else {
				if (mainXAxis && currentXAxis && mainXAxis.type !== currentXAxis.type) {
					setDataFieldValue(index)(FIELDS.xAxis, null);
				}

				this.setMainValue(index, FIELDS.group);
			}
		}
	};

	changeRefFields = () => this.props.values.data.forEach((set, index) => this.changeDependingOnMain(index));

	changeSourceRefs = (index: number) => () => this.changeDependingOnMain(index);

	handleSelectComboGroup = (index: number) => () => {
		if (this.getSet(index).dataKey === this.getMainSet().dataKey) {
			this.changeRefFields();
		}
	};

	setMainValue = (index: number, ...names: Array<string>) => {
		const {setDataFieldValue} = this.props;
		const set = this.getSet(index);
		const mainSet = this.getMainSet();

		names.forEach(name => {
			const mainProperty = mainSet[name];
			const currentProperty = set[name];
			const currentIsNotMain = !currentProperty
				|| mainProperty.code !== currentProperty.code
				|| mainProperty !== currentProperty;

			if (mainProperty && currentIsNotMain) {
				setDataFieldValue(index)(name, mainProperty);
			}
		});
	};

	renderChartInput = (index: number) => {
		const {setDataFieldValue} = this.props;
		const set = this.getSet(index);

		return (
			<div className={styles.chartInput}>
				<MiniSelect
					name={FIELDS.type}
					onSelect={setDataFieldValue(index)}
					options={CHART_OPTIONS}
					showCaret={false}
					tip="Тип графика"
					value={set[FIELDS.type]}
				/>
			</div>
		);
	};

	renderXAxis = (index: number) => {
		const set = this.getSet(index);
		const mainSet = this.getMainSet();
		const mainSource = mainSet[FIELDS.source];
		const currentSource = set[FIELDS.source];
		const currentXAxis = set[FIELDS.xAxis];
		let onSelectCallback;

		if (mainSource && currentSource && mainSource.value === currentSource.value) {
			onSelectCallback = this.changeRefFields;
		}

		const refInputProps = {
			disabled: false,
			name: FIELDS.group,
			onSelectCallback: this.handleSelectComboGroup(index),
			type: 'group',
			value: set[FIELDS.group]
		};

		const props = {
			disabled: false,
			name: FIELDS.xAxis,
			onSelectCallback,
			options: undefined,
			refInputProps,
			value: currentXAxis
		};

		if (set.dataKey !== mainSet.dataKey && mainSource && currentSource) {
			if (mainSource.value === currentSource.value) {
				props.disabled = true;
			} else {
				const mainXAxis = mainSet[FIELDS.xAxis];
				let xAxisOptions = this.getAttributeOptions(currentSource.value);

				if (xAxisOptions.length > 0 && mainXAxis) {
					const {DATE, OBJECT} = ATTRIBUTE_SETS;

					xAxisOptions = xAxisOptions.filter(attribute => {
						if (mainXAxis.type in OBJECT) {
							return attribute.property === mainXAxis.property;
						}

						if (mainXAxis.type in DATE) {
							return attribute.type in DATE;
						}

						return mainXAxis.type === attribute.type;
					});
				}

				props.options = xAxisOptions;
			}

			refInputProps.disabled = true;
		}

		return this.renderAttribute(index, props);
	};

	renderXAxisSection = () => (
		<FormBox title="Параметр">
			{this.renderByOrder(this.renderXAxis, false)}
		</FormBox>
	);

	renderYAxis= (index: number) => {
		const set = this.getSet(index);

		const refInputProps = {
			name: FIELDS.aggregation,
			type: 'aggregation',
			value: set[FIELDS.aggregation]
		};

		const props = {
			name: FIELDS.yAxis,
			placeholder: 'Ось Y',
			refInputProps,
			value: set[FIELDS.yAxis],
			withCreate: true
		};

		return (
			<Fragment>
				{this.renderAttribute(index, props)}
				{this.renderBreakdown(index)}
			</Fragment>
		);
	};

	renderYAxisSection = (index: number) => (
		<FormBox leftControl={this.renderChartInput(index)} title="Показатель">
			{this.renderYAxis(index)}
		</FormBox>
	);

	render () {
		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection(this.changeSourceRefs)}
				{this.renderXAxisSection()}
				{this.renderByOrder(this.renderYAxisSection)}
			</Fragment>
		);
	}
}

export default ParamsTab;
