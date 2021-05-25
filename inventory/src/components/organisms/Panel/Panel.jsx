// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelContent from 'components/molecules/PanelContent';
import PanelHeader from 'components/molecules/PanelHeader';
import type {Props, State} from './types';
import React, {Component} from 'react';
import Scrollable from 'components/atoms/Scrollable';
import styles from './Panel.less';

export class Panel extends Component<Props, State> {
	panelContainerRef: {current: null | HTMLDivElement};

	constructor (props: Props) {
		super(props);
		this.panelContainerRef = React.createRef();
	}

	componentDidUpdate () {
		if (this.panelContainerRef.current) {
			window.setTimeout(() => {
				if (this.panelContainerRef.current) {
					this.panelContainerRef.current.scrollTop = 0;
				}
			}, 100);
		}
	}

	attachRef = (element: null | HTMLDivElement) => {
		this.panelContainerRef.current = element;
	}

	render () {
		const {open} = this.props;

		if (open) {
			return (
				<div className={styles.panelWrap}>
					<div >
						<div className={styles.panelContainer}>
							<PanelHeader />
						</div>
					</div>
					<div className={styles.panelContentWrap}>
						<div className={styles.panelContentContainer} >
							<Scrollable scrollbarColors='grey' attachRef={this.attachRef}>
								<PanelContent />
							</Scrollable>
						</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
export default connect(props, functions)(Panel);
