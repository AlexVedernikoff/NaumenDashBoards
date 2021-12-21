// @flow
import ChoiceWidgetTooltipForm from 'components/organisms/WidgetForm/components/ChoiceWidgetTooltipForm';
import FiltersOnWidget from 'containers/FiltersOnWidget';
import type {InnerFormErrors} from 'containers/DiagramWidgetForm/types';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';

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
				<ChoiceWidgetTooltipForm onChange={onChange} value={values} />
				<FiltersOnWidget onChange={onChange} raiseErrors={this.handleRaiseErrors} values={values} />
			</Fragment>
		);
	}
}

export default OptionsTab;
