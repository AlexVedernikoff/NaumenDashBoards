// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelContentDynamic from 'components/molecules/PanelContentDynamic';
import PanelContentStatic from 'components/molecules/PanelContentStatic';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelContent.less';

export class PanelContent extends Component<Props, State> {
	render () {
		const {panelShow} = this.props;

		return (
			<div>
				{panelShow === 'dynamic' ? <PanelContentDynamic /> : <PanelContentStatic />}
			</div>
		);
	}
}
export default connect(props, functions)(PanelContent);
