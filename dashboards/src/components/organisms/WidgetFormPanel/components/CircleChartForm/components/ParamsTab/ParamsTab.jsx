// @flow
import type {DataBuilderProps} from 'WidgetFormPanel/builders/DataFormBuilder/types';
import {FIELDS} from 'components/organisms/WidgetFormPanel';
import React, {Component, Fragment} from 'react';
import {withDataFormBuilder} from 'WidgetFormPanel/builders';

export class ParamsTab extends Component<DataBuilderProps> {
	sourceRefFields = [FIELDS.breakdown, FIELDS.indicator];

	renderSourceBox = () => {
		const {renderSourceBox} = this.props;
		const props = {
			sourceRefFields: this.sourceRefFields
		};

		return renderSourceBox(props);
	};

	render () {
		const {renderBaseBoxes, renderIndicatorBoxes} = this.props;

		return (
			<Fragment>
				{renderBaseBoxes()}
				{this.renderSourceBox()}
				{renderIndicatorBoxes()}
			</Fragment>
		);
	}
}

export default withDataFormBuilder(ParamsTab);
