// @flow
import {AttributeFieldsetContext} from './withAttributeFieldset';
import Component from 'DiagramWidgetEditForm/components/AttributeFieldset';
import {connect} from 'react-redux';
import type {ContextProps} from './types';
import {functions, props} from './selectors';
import type {Props} from 'DiagramWidgetEditForm/components/AttributeFieldset/types';
import React, {PureComponent} from 'react';

export class AttributeFieldset extends PureComponent<Props> {
	render () {
		const {dataKey, dataSetIndex, source} = this.props;
		const context: ContextProps = {
			dataKey,
			dataSetIndex,
			source
		};

		return (
			<AttributeFieldsetContext.Provider value={context}>
				<Component {...this.props} />
			</AttributeFieldsetContext.Provider>
		);
	}
}

export default connect(props, functions)(AttributeFieldset);
