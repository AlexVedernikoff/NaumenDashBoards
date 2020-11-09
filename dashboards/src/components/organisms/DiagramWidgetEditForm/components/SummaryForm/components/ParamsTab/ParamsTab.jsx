// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import {FIELDS} from 'containers/WidgetEditForm/constants';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.indicator];

	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			usesBreakdown: false
		};

		return renderIndicatorBoxes(props);
	};

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const sourceRefFields = {
			indicator: FIELDS.indicator
		};

		return renderSourceBox(sourceRefFields);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{this.renderIndicatorBoxes()}
				{renderDisplayModeSelect()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
