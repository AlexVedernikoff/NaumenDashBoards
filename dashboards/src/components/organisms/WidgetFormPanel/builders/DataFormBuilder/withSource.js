// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {ContextProps} from 'WidgetFormPanel/types';
import type {DataSet} from 'containers/WidgetFormPanel/types';
import {DYNAMIC_ATTRIBUTE_PROPERTY} from 'store/sources/attributes/constants';
import {FIELDS} from 'WidgetFormPanel/constants';
import {getDataErrorKey} from 'WidgetFormPanel/helpers';
import {getDefaultAggregation} from 'WidgetFormPanel/components/AttributeAggregationField/helpers';
import {getMapValues} from 'src/helpers';
import {IconButton} from 'components/atoms';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {OnChangeInputEvent, OnSelectEvent} from 'components/types';
import React from 'react';
import type {RenderSourceFieldsetProps, SourceInjectedProps, SourceRefFields} from './types';
import {SourceFieldset} from 'WidgetFormPanel/components';
import uuid from 'tiny-uuid';

export const withSource = (Component: React$ComponentType<SourceInjectedProps>) => {
	return class WrappedComponent extends React.Component<ContextProps> {
		handleAddSource = () => {
			const {setFieldValue, values} = this.props;
			const set = {
				[FIELDS.dataKey]: uuid(),
				[FIELDS.descriptor]: '',
				[FIELDS.sourceForCompute]: true
			};
			const data = [...values.data, set];

			setFieldValue(FIELDS.data, data);
		};

		handleChangeCompute = (index: number, event: OnChangeInputEvent) => {
			const {setDataFieldValue} = this.props;
			const name = FIELDS.sourceForCompute;
			const {value} = event;

			setDataFieldValue(index, name, value);
		};

		handleChangeDescriptor = (sourceRefFields: SourceRefFields) => (index: number, descriptor: string) => {
			const {fetchDynamicAttributeGroups, setDataFieldValue, values} = this.props;

			if (descriptor) {
				const {dataKey} = values.data[index];
				fetchDynamicAttributeGroups(dataKey, descriptor);
			}

			setDataFieldValue(index, FIELDS.descriptor, descriptor);
			this.resetDynamicAttributes(index, sourceRefFields);
		};

		handleRemoveSource = (index: number) => {
			const {setFieldValue, values} = this.props;
			const {data} = values;

			if (data.length > 1) {
				data.splice(index, 1);
				setFieldValue(FIELDS.data, data);
			}
		};

		handleSelectSource = (onSelectCallback: Function) =>
			(index: number, event: OnSelectEvent, sourceRefFields: SourceRefFields) => {
				const {fetchAttributes, setDataFieldValue, values} = this.props;
				const {name, value: nextSource} = event;
				const prevSource = values.data[index][name];
				let callback;

				if (onSelectCallback) {
					callback = onSelectCallback(index, sourceRefFields);
				}

				getMapValues(sourceRefFields).forEach(name => setDataFieldValue(index, name, undefined));

				if (nextSource) {
					fetchAttributes(nextSource.value, this.setDefaultIndicator(index, sourceRefFields));
				}

				setDataFieldValue(index, name, nextSource, callback);

				if ((prevSource && !nextSource) || (nextSource && prevSource && prevSource.value !== nextSource.value)) {
					setDataFieldValue(index, FIELDS.descriptor, '');
				}
			};

		resetDynamicAttributes = (index: number, sourceRefFields: SourceRefFields) => {
			const {setDataFieldValue, values} = this.props;
			const set = values.data[index];

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

		setDefaultIndicator = (index: number, sourceRefFields: SourceRefFields) => (attributes: Array<Attribute>) => {
			const {setDataFieldValue} = this.props;
			let indicator = attributes.find(attribute => attribute.code === 'UUID');

			if (sourceRefFields.indicator === FIELDS.indicators) {
				indicator = [{
					aggregation: getDefaultAggregation(indicator),
					attribute: indicator
				}];
			}

			setDataFieldValue(index, sourceRefFields.indicator, indicator);
		};

		renderAddSourceInput = () => <IconButton icon={ICON_NAMES.PLUS} onClick={this.handleAddSource} />;

		renderSourceFieldset = (props: RenderSourceFieldsetProps) => (set: DataSet, index: number) => {
			const {errors, setDataFieldValue, sources: baseSources, values} = this.props;
			const {onSelectCallback, sourceRefFields, sources = baseSources, usesFilter} = props;
			const error = errors[getDataErrorKey(index, FIELDS.source)];
			const removable = values.data.length > 1;

			return (
				<SourceFieldset
					error={error}
					index={index}
					key={index}
					name={FIELDS.source}
					onChange={setDataFieldValue}
					onChangeCompute={this.handleChangeCompute}
					onChangeDescriptor={this.handleChangeDescriptor(sourceRefFields)}
					onRemove={this.handleRemoveSource}
					onSelectSource={this.handleSelectSource(onSelectCallback)}
					removable={removable}
					set={set}
					sourceRefFields={sourceRefFields}
					sources={sources}
					usesFilter={usesFilter}
				/>
			);
		};

		render () {
			return (
				<Component
					{...this.props}
					renderAddSourceInput={this.renderAddSourceInput}
					renderSourceFieldset={this.renderSourceFieldset}
				/>
			);
		}
	};
};

export default withSource;
