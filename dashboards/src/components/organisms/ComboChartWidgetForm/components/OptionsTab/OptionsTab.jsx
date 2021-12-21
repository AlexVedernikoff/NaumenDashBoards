// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FiltersOnWidget from 'containers/FiltersOnWidget';
import type {InnerFormErrors} from 'containers/DiagramWidgetForm/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import SimpleWidgetTooltipForm from 'components/organisms/WidgetForm/components/SimpleWidgetTooltipForm';

export class OptionsTab extends PureComponent<Props> {
	handleRaiseErrors = (errors: InnerFormErrors) => {
		const {raiseErrors} = this.props;

		if (raiseErrors) {
			raiseErrors(errors);
		}
	};

	render () {
		const {onChange, values} = this.props;
		const {tooltip} = values;

		return (
			<Fragment>
				<SimpleWidgetTooltipForm canIndicators={false} name={DIAGRAM_FIELDS.tooltip} onChange={onChange} value={tooltip} />
				<FiltersOnWidget onChange={onChange} raiseErrors={this.handleRaiseErrors} values={values} />
			</Fragment>
		);
	}
}

export default OptionsTab;
