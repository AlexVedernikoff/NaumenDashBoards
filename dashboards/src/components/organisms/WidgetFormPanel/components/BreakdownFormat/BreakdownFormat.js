// @flow
import CollapsableFormBox from 'components/molecules/CollapsableFormBox';
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import {getDefaultFormatForAttribute, getMainDataSet} from 'store/widgets/data/helpers';
import ParameterFormatPanel from 'components/molecules/ParameterFormatPanel';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class BreakdownFormat extends PureComponent<Props> {
	handleChangeBreakdownFormat = (format) => {
		const {onChange} = this.props;

		onChange(DIAGRAM_FIELDS.breakdownFormat, format);
	};

	render () {
		const {data} = this.props;
		const {breakdown} = getMainDataSet(data);

		if (Array.isArray(breakdown) && breakdown.length > 0) {
			const {attribute, group} = breakdown[0];
			const format = this.props.breakdown ?? getDefaultFormatForAttribute(attribute, group);

			if (format) {
				return (
					<CollapsableFormBox title='Разбивка'>
						<ParameterFormatPanel
							onChange={this.handleChangeBreakdownFormat}
							value={format}
						/>
					</CollapsableFormBox>
				);
			}
		}

		return null;
	}
}

export default BreakdownFormat;
