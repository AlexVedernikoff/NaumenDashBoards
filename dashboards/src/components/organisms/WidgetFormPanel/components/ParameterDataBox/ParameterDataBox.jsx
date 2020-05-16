// @flow
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormBox} from 'components/molecules';
import {getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultSystemGroup} from 'store/widgets/helpers';
import {getMainDataSet} from 'utils/normalizer/widget/helpers';
import {getProcessedValue} from 'store/sources/attributes/helpers';
import type {OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import {ParameterFieldset} from 'WidgetFormPanel/components';
import type {Props, State} from './types';
import React, {Component} from 'react';

export class ParameterDataBox extends Component<Props, State> {
	static defaultProps = {
		children: null,
		name: FIELDS.parameter,
		useGroup: true
	};

	state = {};

	static getDerivedStateFromProps (props: Props) {
		const {data} = props.values;

		return {
			mainSet: getMainDataSet(data)
		};
	}

	handleSelect = (event: OnSelectAttributeEvent, index: number) => {
		const {name, onSelectCallback, setDataFieldValue, setFieldValue, transformAttribute, useGroup, values} = this.props;
		const {mainSet} = this.state;
		const currentValue = values.data[index][name];
		let {value} = event;
		let callback;

		if (mainSet === values.data[index]) {
			callback = onSelectCallback(name);

			if (name === FIELDS.xAxis) {
				const {parameter} = values;

				setFieldValue(FIELDS.parameter, {
					...parameter,
					name: getProcessedValue(value, 'title')
				});
			}
		}

		value = transformAttribute(event, this.handleSelect, index);

		if (useGroup && (!currentValue || currentValue.type !== value.type)) {
			setDataFieldValue(index, FIELDS.group, getDefaultSystemGroup(value));
		}

		setDataFieldValue(index, name, value, callback);
	};

	renderParameterFieldset = (set: DataSet, index: number) => {
		const {errors, getAttributeOptions, getSourceOptions, name, onChangeGroup, onChangeLabel, useGroup} = this.props;
		const {mainSet} = this.state;
		const errorKey = getDataErrorKey(index, name);

		if (mainSet) {
			return (
				<ParameterFieldset
					error={errors[errorKey]}
					getAttributeOptions={getAttributeOptions}
					getSourceOptions={getSourceOptions}
					index={index}
					key={errorKey}
					mainSet={mainSet}
					name={name}
					onChangeGroup={onChangeGroup}
					onChangeLabel={onChangeLabel}
					onSelect={this.handleSelect}
					set={set}
					useGroup={useGroup}
				/>
			);
		}

		return null;
	};

	render () {
		const {children, values} = this.props;

		return (
			<FormBox title="Параметр">
				{values.data.map(this.renderParameterFieldset)}
				{children}
			</FormBox>
		);
	}
}

export default ParameterDataBox;
