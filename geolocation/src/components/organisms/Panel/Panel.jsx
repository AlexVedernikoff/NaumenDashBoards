// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelContent from 'components/molecules/PanelContent';
import PanelHeader from 'components/molecules/PanelHeader';
import type {Props, State} from './types';
import React, {Component} from 'react';
import styles from './Panel.less';

export class Panel extends Component<Props, State> {
	panelContainerRef: {current: null | HTMLDivElement};

	constructor (props: Props) {
		super(props);
		this.panelContainerRef = React.createRef();
	}

	componentDidUpdate (prevProps: Props) {
		const {showSinglePoint} = this.props;

		if (!prevProps.showSinglePoint && showSinglePoint && this.panelContainerRef.current) {
			this.panelContainerRef.current.scrollTop = 0;
		}
	}

	render () {
		const {open} = this.props;

		if (open) {
			return (
				<div className={styles.panelWrap}>
					<div className={styles.panelContainer} ref={this.panelContainerRef}>
						<PanelHeader />
						<PanelContent />
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
export default connect(props, functions)(Panel);
