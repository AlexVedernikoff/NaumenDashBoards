// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelContentPoints from 'components/molecules/PanelContentPoints';
import PanelShowAll from 'components/atoms/PanelShowAll';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './PanelContent.less';

export class PanelContent extends Component<Props, State> {
	render () {
		const {showSinglePoint} = this.props;

		return (
			<div className={styles.contentContainer}>
				{showSinglePoint && <PanelShowAll />}
				<PanelContentPoints />
			</div>
		);
	}
}
export default connect(props, functions)(PanelContent);
