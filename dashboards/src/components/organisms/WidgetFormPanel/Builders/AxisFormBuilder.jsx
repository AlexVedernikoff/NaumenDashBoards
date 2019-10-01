// @flow
import type {AttrSelectProps} from 'components/organisms/WidgetFormPanel/types';
import DataFormBuilder from './DataFormBuilder';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import {getActualAggregate, typeOfExtendedAggregate} from 'utils/aggregate';
import type {OptionType} from 'react-select/src/types';
import {typeOfExtendedGroups} from 'utils/group';

export class AxisFormBuilder extends DataFormBuilder {
	createName = (num: number) => (name: string) => `${name}_${num}`;

	createRefName = (targetName: string, baseRefName: string) => {
		const number = this.getNumberFromName(targetName);
		return number !== targetName ? this.createName(number)(baseRefName) : baseRefName;
	};

	handleSelectXAxis = (name: string, value: OptionType) => {
		const {setFieldValue} = this.props;
		const groupName = this.createRefName(name, FIELDS.group);

		setFieldValue(name, value);

		if (!typeOfExtendedGroups(value)) {
			setFieldValue(groupName, null);
		}
	};

	handleSelectYAxis = (name: string, value: OptionType) => {
		const {setFieldValue, values} = this.props;
		const aggregateName = this.createRefName(name, FIELDS.aggregate);

		setFieldValue(name, value);

		if (!typeOfExtendedAggregate(value)) {
			setFieldValue(aggregateName, getActualAggregate(value, values.group));
		}
	};

	renderXAxisInput = (name: string = FIELDS.xAxis) => {
		const {values} = this.props;

		const xAxis: AttrSelectProps = {
			label: 'Ось X',
			name: name,
			onChange: this.handleSelectXAxis,
			placeholder: 'Ось X',
			value: values[name]
		};

		return this.renderAttrSelect(xAxis);
	};

	renderYAxisInput = (name: string = FIELDS.yAxis) => {
		const {values} = this.props;

		const yAxis: AttrSelectProps = {
			label: 'Ось Y',
			name: name,
			onChange: this.handleSelectYAxis,
			placeholder: 'Ось Y',
			value: values[name]
		};

		return this.renderAttrSelect(yAxis);
	};
}

export default AxisFormBuilder;
