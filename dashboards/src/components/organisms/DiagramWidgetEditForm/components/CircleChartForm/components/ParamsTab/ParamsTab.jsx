// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import {FIELDS} from 'DiagramWidgetEditForm/constants';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
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
		const {renderBaseBoxes, renderDisplayModeSelect, renderIndicatorBoxes, renderNavigationBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{renderIndicatorBoxes({usesEmptyData: true, usesTop: true})}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
