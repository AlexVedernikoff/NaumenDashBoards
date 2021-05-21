// @flow
import type {Attribute} from 'store/sources/attributes/types';
import FormField from 'components/molecules/FormField';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import TextInput from 'components/atoms/TextInput';

export class FilterItem extends PureComponent<Props> {
	fetchOptions = () => {
		const {dataSets, fetchAttributes, value} = this.props;
		const {dataSetIndex} = value;

		if (typeof dataSetIndex === 'number') {
			const selectedDataSet = dataSets[dataSetIndex];
			const { attributes = [], attributesLoading } = selectedDataSet;

			if (!attributesLoading && attributes.length === 0) {
				fetchAttributes(dataSetIndex);
			}
		}
	};

	handleChangeAttribute = ({value}) => {
		const {onChangeAttribute} = this.props;
		return onChangeAttribute([value]);
	};

	handleChangeDataSet = ({value}) => {
		const {onChangeDataSet} = this.props;
		const {dataSetIndex} = value;
		return onChangeDataSet(dataSetIndex);
	};

	handleChangeLabel = ({value}) => {
		const {onChangeLabel} = this.props;
		return onChangeLabel(value);
	};

	renderAttributeSelector = (): React$Node => {
		const {dataSets, value} = this.props;

		if (value) {
			const {dataSetIndex} = value;

			if (typeof dataSetIndex === 'number') {
				const selectedDataSet = dataSets[dataSetIndex];
				const { attributes = [], attributesLoading } = selectedDataSet;
				const attribute = value.attributes && value.attributes.length > 0 ? value.attributes[0] : null;

				return (
					<FormField>
						<Select
							fetchOptions={this.fetchOptions}
							getOptionLabel={(attribute: Attribute) => attribute.title}
							getOptionValue={(attribute: Attribute) => attribute}
							isSearching={true}
							loading={attributesLoading}
							onSelect={this.handleChangeAttribute}
							options={attributes}
							placeholder="Укажите атрибут"
							value={attribute}
						/>
					</FormField>
				);
			}
		}

		return null;
	};

	renderDataSetSelector = (): React$Node => {
		const {dataSets, value} = this.props;
		const {dataSetIndex} = value;
		const selected = dataSetIndex !== undefined && dataSetIndex !== null ? dataSets[dataSetIndex] : null;

		return (
			<FormField>
				<Select
					editable={false}
					getOptionLabel={(dataSet) => dataSet.source.value?.label}
					getOptionValue={(dataSet) => dataSet.dataSetIndex}
					onSelect={this.handleChangeDataSet}
					options={dataSets}
					placeholder='Выберите источник'
					value={selected}
				/>
			</FormField>
		);
	};

	renderLabelEditor = (): React$Node => {
		const {value: {label}} = this.props;
		return (
			<FormField>
				<TextInput
					onChange={this.handleChangeLabel}
					placeholder='Название фильтра'
					value={label}
				/>
			</FormField>
		);
	};

	render () {
		return (
			<Fragment>
				{this.renderDataSetSelector()}
				{this.renderLabelEditor()}
				{this.renderAttributeSelector()}
			</Fragment>
		);
	}
}

export default FilterItem;
