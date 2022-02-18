// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelIcon from 'icons/PanelIcon';
import PanelContent from 'components/molecules/PanelContent';
import PanelHeader from 'components/molecules/PanelHeader';
import type {Props} from './types';
import React, {Component} from 'react';
import Scrollable from 'components/atoms/Scrollable';
import styles from './Panel.less';

export class Panel extends Component<Props> {
	panelContainerRef: { current: null | HTMLDivElement };

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
	};

	renderPanelToggle = () => {
		const {panelOpen} = this.props;

		return panelOpen ? (
			<div className={styles.panelContainer}>
				<PanelIcon/>
			</div>
		) : null;
	};

	renderPanelHeader = () => {
		const {panelOpen} = this.props;

		return panelOpen ? <PanelHeader/> : null;
	};

	renderPanelContent = () => {
		const {panelOpen} = this.props;

		return panelOpen ? (
			<div className={styles.panelContainer}>
				<Scrollable scrollbarColors="grey" attachRef={this.attachRef}>
					<PanelContent/>
				</Scrollable>
			</div>
		) : null;
	};

	render () {
		const {panelOpen, togglePanel} = this.props;

		if (panelOpen) {
			return (
				<div className={styles.panelWrap}>
					{this.renderPanelHeader()}
					{this.renderPanelContent()}
					{this.renderPanelToggle()}
				</div>
			);
		}
		return null;
	}
}

export default connect(props, functions)(Panel);
