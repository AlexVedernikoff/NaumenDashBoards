// @flow
import FiltersOnWidget from 'containers/FiltersOnWidget';
import type {InnerFormErrors} from 'containers/DiagramWidgetForm/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import TableTooltipForm from 'components/organisms/TableWidgetForm/components/TableTooltipForm';

export class OptionsTab extends PureComponent<Props> {
	handleRaiseErrors = (errors: InnerFormErrors) => {
		const {raiseErrors} = this.props;

		if (raiseErrors) {
			raiseErrors(errors);
		}
	};

	render () {
		const {onChange, values} = this.props;

		return (
			<Fragment>
				<TableTooltipForm onChange={onChange} value={values} />
				<FiltersOnWidget onChange={onChange} raiseErrors={this.handleRaiseErrors} values={values} />
			</Fragment>
		);
	}
}

export default OptionsTab;
