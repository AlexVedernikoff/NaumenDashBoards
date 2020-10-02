// @flow
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	renderIndicatorBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			usesEmptyData: true
		};

		return renderIndicatorBoxes(props);
	};

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const {breakdown, indicator} = FIELDS;
		const sourceRefFields = {
			breakdown,
			indicator
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
