// @flow
import {connect} from 'react-redux';
import PanelContentPoints from 'components/molecules/PanelContentPoints';
import PanelShowAll from 'components/atoms/PanelShowAll';
import {props} from './selectors';
import type {Props} from './types';
import React, {Component} from 'react';
import styles from './PanelContent.less';

export class PanelContent extends Component<Props> {
	render () {
		const {showSingleObject} = this.props;

		return (
			<div className={styles.contentContainer}>
				{showSingleObject && <PanelShowAll />}
				<PanelContentPoints />
			</div>
		);
	}
}

export default connect(props)(PanelContent);
