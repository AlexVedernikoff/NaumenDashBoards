// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	renderIndicatorsBoxes = () => {
		const {renderIndicatorBoxes} = this.props;
		const props = {
			usesBlankData: true,
			usesEmptyData: true,
			usesTop: true
		};

		return renderIndicatorBoxes(props);
	};

	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderNavigationBox, renderSourceBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{renderSourceBox()}
				{this.renderIndicatorsBoxes()}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
