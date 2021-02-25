// @flow
import type {DataBuilderProps} from 'DiagramWidgetEditForm/builders/DataFormBuilder/types';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'DiagramWidgetEditForm/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	render () {
		const {renderBaseBoxes, renderDisplayModeSelect, renderIndicatorBoxes, renderNavigationBox, renderSourceBox} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{renderSourceBox()}
				{renderIndicatorBoxes({usesEmptyData: true, usesTop: true})}
				{renderDisplayModeSelect()}
				{renderNavigationBox()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
