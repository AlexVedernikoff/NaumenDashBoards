// @flow
import type {Attribute} from 'store/sources/attributes/types';
import {DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {FormBox} from 'components/molecules';
import {getMapValues} from 'src/helpers';
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Component} from 'react';
import {SourceFieldset} from 'WidgetFormPanel/components';
import uuid from 'tiny-uuid';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class SourceDataBox extends Component<Props> {
	static defaultProps = {
		minCountBuildingSources: 1
	};

	componentDidMount () {
		let {data, minCountBuildingSources, type} = this.props;

		if (data.length < minCountBuildingSources) {
			const diff = minCountBuildingSources - data.length;
			data = this.addSet(diff);
		}

		const buildSets = this.getBuildSets(data);

		if (type !== WIDGET_TYPES.COMBO && buildSets.length > minCountBuildingSources) {
			this.reduceBuildSources(data);
		}

		if (buildSets.length < minCountBuildingSources) {
			this.increaseBuildSources(data);
		}
	}

	addSet = (count: number = 1) => {
		const {data, setFieldValue} = this.props;
		let currentCount = count;

		while (currentCount > 0) {
			data.push({
				[FIELDS.dataKey]: uuid(),
				[FIELDS.descriptor]: '',
				[FIELDS.sourceForCompute]: true
			});
			setFieldValue(FIELDS.data, data);
			currentCount--;
		}

		return data;
	};

	getBuildSets = (data: Array<Object>) => {
		const sets = [];

		data.forEach((set, index) => {
			if (!set[FIELDS.sourceForCompute]) {
				sets.push(index);
			}
		});

		return sets;
	};

	handleChangeCompute = (index: number, event: OnChangeInputEvent) => {
		const {data, minCountBuildingSources, setDataFieldValue, type} = this.props;
		const buildSets = this.getBuildSets(data);
		const name = FIELDS.sourceForCompute;
		const {value} = event;

		if (!value && type !== WIDGET_TYPES.COMBO) {
			data.every((set, i) => {
				if (!set[name]) {
					setDataFieldValue(i, name, true);
					return false;
				}

				return true;
			});
		}

		if (!value || buildSets.length > minCountBuildingSources) {
			setDataFieldValue(index, name, value);
		}
	};

	handleClickAddSource = () => {
		this.addSet(1);
	};

	handleSelectSource = (index: number, event: OnSelectEvent) => {
		const {data, fetchAttributes, onSelectCallback, setDataFieldValue, sourceRefFields} = this.props;
		const {name, value: nextSource} = event;
		const prevSource = data[index][name];
		const {parameter} = sourceRefFields;

		getMapValues(sourceRefFields).forEach(name => setDataFieldValue(index, name, undefined));

		if (nextSource) {
			let callback;

			if (parameter) {
				callback = onSelectCallback(parameter);
			}

			fetchAttributes(nextSource.value, this.setDefaultIndicator(index));
			setDataFieldValue(index, name, nextSource, callback);
		} else {
			setDataFieldValue(index, name, null);
		}

		if ((prevSource && !nextSource) || (nextSource && prevSource && prevSource.value !== nextSource.value)) {
			setDataFieldValue(index, FIELDS.descriptor, '');
		}
	};

	increaseBuildSources = (data: Array<Object>) => {
		const {minCountBuildingSources, setDataFieldValue} = this.props;
		const name = FIELDS.sourceForCompute;
		let countBuildSets = 0;

		data.every((set, index) => {
			if (set[name]) {
				setDataFieldValue(index, name, false);
				countBuildSets++;
			}

			return countBuildSets === minCountBuildingSources;
		});
	};

	reduceBuildSources = (data: Array<Object>) => {
		const {minCountBuildingSources, setDataFieldValue} = this.props;
		const name = FIELDS.sourceForCompute;
		let countBuildSources = 0;

		data.forEach((set, index) => {
			if (!set[name]) {
				if (countBuildSources >= minCountBuildingSources) {
					setDataFieldValue(index, name, true);
				} else {
					countBuildSources++;
				}
			}
		});
	};

	removeSet = (index: number) => {
		const {data, minCountBuildingSources, setFieldValue} = this.props;

		if (data.length > minCountBuildingSources) {
			data.splice(index, 1);

			setFieldValue(FIELDS.data, data);
			this.increaseBuildSources(data);
		}
	};

	resetDynamicAttributes = (index: number) => {
		const {data, setDataFieldValue, sourceRefFields} = this.props;
		const set = data[index];

		getMapValues(sourceRefFields).forEach(name => {
			let value = set[name];

			if (name === FIELDS.breakdown && Array.isArray(value)) {
				value = value.map(breakdownSet => {
					return breakdownSet.value && breakdownSet.value === DYNAMIC_ATTRIBUTE_PROPERTY ? null : breakdownSet;
				});

				setDataFieldValue(index, name, value);
			} else if (value && set[name].property === DYNAMIC_ATTRIBUTE_PROPERTY) {
				setDataFieldValue(index, name, undefined);
			}
		});
	};

	setDefaultIndicator = (index: number) => (attributes: Array<Attribute>) => {
		const {setDataFieldValue, sourceRefFields} = this.props;
		const indicator = attributes.find(attribute => attribute.code === 'UUID');

		indicator && setDataFieldValue(index, sourceRefFields.indicator, indicator);
	};

	renderAddSourceInput = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleClickAddSource} />;

	renderSource = (set: Object, index: number) => {
		const {data, errors, minCountBuildingSources, setDataFieldValue, sources} = this.props;
		const removable = data.length > minCountBuildingSources;

		return (
			<SourceFieldset
				errors={errors}
				index={index}
				key={index}
				name={FIELDS.source}
				onChange={setDataFieldValue}
				onChangeCompute={this.handleChangeCompute}
				onRemove={this.removeSet}
				onSelectSource={this.handleSelectSource}
				removable={removable}
				resetDynamicAttributes={this.resetDynamicAttributes}
				set={set}
				sources={sources}
			/>
		);
	};

	render () {
		const {data} = this.props;

		return (
			<FormBox rightControl={this.renderAddSourceInput()} title="Источник">
				{data.map(this.renderSource)}
			</FormBox>
		);
	}
}

export default SourceDataBox;
