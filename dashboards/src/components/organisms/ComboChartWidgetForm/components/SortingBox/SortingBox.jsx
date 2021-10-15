// @flow
import BaseSortingBox from 'WidgetFormPanel/components/SortingBox';
import Container from 'components/atoms/Container';
import type {ContainerProps} from 'WidgetFormPanel/components/SortingBox/types';
import type {DataSet} from 'store/widgetForms/comboChartForm/types';
import FormField from 'components/molecules/FormField';
import {getAttributeValue} from 'store/sources/attributes/helpers';
import memoize from 'memoize-one';
import type {OnSelectEvent} from 'components/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import Select from 'components/molecules/Select';
import type {SortingValue} from 'store/widgets/data/types';
import {SORTING_VALUES} from 'store/widgets/data/constants';

export class SortingBox extends PureComponent<Props> {
	static defaultProps = BaseSortingBox.defaultProps;

	getComponents = memoize(() => ({
		Container: this.renderContainer
	}));

	getIndicatorLabel = (value: SortingValue) => (dataSet: DataSet) => {
		const {indicators, parameters, source} = dataSet;
		const {value: sourceValue} = source;
		const attribute = value === SORTING_VALUES.INDICATOR ? indicators[0].attribute : parameters?.[0].attribute;
		let label = getAttributeValue(attribute, 'title');

		if (label && sourceValue) {
			label = `${label} (${sourceValue.label})`;
		}

		return label;
	};

	getIndicatorValue = (dataSet: DataSet) => dataSet.dataKey;

	handleSelectIndicator = ({value}: OnSelectEvent) => {
		const {name, onChange, value: settings} = this.props;

		onChange(name, {
			...settings,
			dataKey: value.dataKey
		});
	};

	renderContainer = (props: ContainerProps) => {
		const {children, className} = props;

		return (
			<Fragment>
				<Container className={className} >
					{children}
				</Container>
				{this.renderIndicators()}
			</Fragment>
		);
	};

	renderIndicators = () => {
		const {data, value} = this.props;
		const {dataKey: sortingDataKey = '', value: sortingValue} = value;

		if (sortingValue !== SORTING_VALUES.DEFAULT) {
			const dataSet = data.find(({dataKey}) => dataKey === sortingDataKey) || data[0];
			const options = data.filter(({sourceForCompute}) => !sourceForCompute);

			return (
				<FormField small={true}>
					<Select
						getOptionLabel={this.getIndicatorLabel(sortingValue)}
						getOptionValue={this.getIndicatorValue}
						onSelect={this.handleSelectIndicator}
						options={options}
						value={dataSet}
					/>
				</FormField>
			);
		}
	};

	render () {
		const {data, ...props} = this.props;

		return <BaseSortingBox {...props} components={this.getComponents()} />;
	}
}

export default SortingBox;
