// @flow
import {createOrdinalName, createRefName, getNumberFromName} from 'utils/widget';
import {DataFormBuilder} from 'components/organisms/WidgetFormPanel/builders';
import {FIELDS, OPTIONS, styles as mainStyles} from 'components/organisms/WidgetFormPanel';
import React, {Fragment} from 'react';
import type {SelectValue} from 'components/organisms/WidgetFormPanel/types';
import {styles} from 'components/organisms/WidgetFormPanel/Tabs/ParamsTab';
import {TYPES} from 'store/sources/attributes/constants';
import withForm from 'components/organisms/WidgetFormPanel/withForm';

export class ComboChart extends DataFormBuilder {
	defaultOrder = [1, 2];
	sourceRefs = [FIELDS.breakdown, FIELDS.xAxis, FIELDS.yAxis];

	changeDependingOnMain = (number: number) => {
		const {setFieldValue, values} = this.props;
		const mainNumber = this.getMainNumber();
		const mainSource = values[createOrdinalName(FIELDS.source, mainNumber)];
		const currentSource = values[createOrdinalName(FIELDS.source, number)];

		if (mainNumber !== number && mainSource && currentSource) {
			const xAxisName = createOrdinalName(FIELDS.xAxis, number);
			const groupName = createOrdinalName(FIELDS.group, number);
			const currentXAxis = values[xAxisName];

			if (mainSource.value === currentSource.value) {
				this.setMainValue(xAxisName, groupName);
			} else {
				const mainXAxis = values[createOrdinalName(FIELDS.xAxis, mainNumber)];

				if (mainXAxis && currentXAxis && mainXAxis.type !== currentXAxis.type) {
					setFieldValue(xAxisName, null);
				}

				this.setMainValue(groupName);
			}
		}
	};

	changeRefFields = () => this.getOrder().forEach(this.changeDependingOnMain);

	changeSourceRefs = (name: string) => this.changeDependingOnMain(getNumberFromName(name));

	getMainNumber = () => this.getOrder()[0];

	handleSelectComboGroup = async (name: string, group: SelectValue) => {
		await this.handleSelect(name, group);

		if (getNumberFromName(name) === this.getMainNumber()) {
			this.changeRefFields();
		}
	};

	setMainValue = (...names: Array<string>) => {
		const {setFieldValue, values} = this.props;
		const mainNumber = this.getMainNumber();

		names.forEach(async name => {
			const mainProperty = values[createOrdinalName(this.getBaseName(name), mainNumber)];
			const currentProperty = values[name];
			const currentIsNotMain = !currentProperty
				|| mainProperty.code !== currentProperty.code
				|| mainProperty !== currentProperty;

			if (mainProperty && currentIsNotMain) {
				setFieldValue(name, mainProperty);
			}
		});
	};

	renderChartInput = (name: string = FIELDS.type) => {
		const {values} = this.props;

		const chart = {
			name: name,
			options: OPTIONS.CHARTS,
			showCaret: false,
			tip: 'Тип графика',
			value: values[name]
		};

		return (
			<div className={mainStyles.field}>
				<div className={styles.chartInputContainer}>
					<div className={styles.chartInput}>
						{this.renderMiniSelect(chart)}
					</div>
					<div>Ось Y</div>
				</div>
			</div>
		);
	};

	renderXAxis = (name: string) => {
		const {values} = this.props;
		const mainNumber = this.getMainNumber();
		const mainSource = values[createOrdinalName(FIELDS.source, mainNumber)];
		const currentNumber = getNumberFromName(name);
		const currentSource = values[createOrdinalName(FIELDS.source, currentNumber)];
		const currentGroupName = createOrdinalName(FIELDS.group, currentNumber);
		const currentXAxis = values[name];
		let onSelectCallback;

		if (mainSource === currentSource) {
			onSelectCallback = this.changeRefFields;
		}

		const refInputProps = {
			name: currentGroupName,
			mixin: {
				isDisabled: false,
				onSelect: this.handleSelectComboGroup
			},
			type: 'group',
			value: values[currentGroupName]
		};

		const props = {
			isDisabled: false,
			name,
			onSelectCallback,
			options: undefined,
			refInputProps,
			value: currentXAxis
		};

		if (mainNumber !== currentNumber && mainSource && currentSource) {
			if (mainSource.value === currentSource.value) {
				props.isDisabled = true;
			} else {
				const mainXAxis = values[createOrdinalName(FIELDS.xAxis, mainNumber)];
				let xAxisOptions = this.getAttributeOptions(currentSource.value);

				if (xAxisOptions.length > 0 && mainXAxis) {
					const {DATE, OBJECT} = TYPES;

					xAxisOptions = xAxisOptions.filter(a => {
						if (OBJECT.includes(mainXAxis.type)) {
							return a.property === mainXAxis.property;
						}

						if (DATE.includes(mainXAxis.type)) {
							return DATE.includes(a.type);
						}

						return false;
					});
				}

				props.options = xAxisOptions;
			}

			refInputProps.mixin.isDisabled = true;
		}

		return this.renderAttribute(props);
	};

	renderYAxis = (name: string) => {
		const chartName = createRefName(name, FIELDS.type);
		const breakdownName = createRefName(name, FIELDS.breakdown);

		return (
			<div key={name}>
				{this.renderChartInput(chartName)}
				{this.renderYAxisInput(name)}
				{this.renderBreakdown(breakdownName)}
			</div>
		);
	};

	renderYAxisInput = (name: string) => {
		const {values} = this.props;
		const aggregationName = createRefName(name, FIELDS.aggregation);

		const refInputProps = {
			name: aggregationName,
			type: 'aggregation',
			value: values[aggregationName]
		};

		const props = {
			name,
			placeholder: 'Ось Y',
			refInputProps,
			value: values[name],
			withCreate: true
		};

		return this.renderAttribute(props);
	};

	render () {
		const {xAxis, yAxis} = FIELDS;

		return (
			<Fragment>
				{this.renderBaseInputs()}
				{this.renderSourceSection(this.changeSourceRefs)}
				{this.renderLabel('Ось Х')}
				{this.renderByOrder(this.renderXAxis, xAxis, false)}
				{this.renderByOrder(this.renderYAxis, yAxis)}
			</Fragment>
		);
	}
}

export default withForm(ComboChart);
