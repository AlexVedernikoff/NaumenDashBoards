// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelContent from 'components/molecules/PanelContent';
import PanelHeader from 'components/molecules/PanelHeader';
import PanelIcon from 'icons/PanelIcon';
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

	renderPanelContent = () => {
		const {panelOpen} = this.props;

		return panelOpen ? (
			<div className={styles.panelContainer}>
				<Scrollable attachRef={this.attachRef} scrollbarColors="grey">
					<PanelContent />
				</Scrollable>
			</div>
		) : null;
	};

	renderPanelHeader = () => {
		const {panelOpen} = this.props;

		return panelOpen ? <PanelHeader /> : null;
	};

	renderPanelToggle = togglePanel => {
		const {panelOpen} = this.props;

		return panelOpen ? (
			<div className={styles.panelContainer}>
				<PanelIcon />
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
					{this.renderPanelToggle(togglePanel)}
				</div>
			);
		}

		return null;
	}
}

export default connect(props, functions)(Panel);
