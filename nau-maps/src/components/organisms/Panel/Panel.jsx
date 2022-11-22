// @flow
import cn from 'classnames';
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import PanelContent from 'components/molecules/PanelContent';
import PanelHeader from 'components/molecules/PanelHeader';
import PanelIcon from 'icons/PanelIcon';
import PanelSearch from 'components/molecules/PanelSearch';
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
		return (
			<Scrollable attachRef={this.attachRef}>
				<PanelContent />
			</Scrollable>
		);
	};

	renderPanelHeader = () => {
		return <PanelHeader />;
	};

	renderPanelSearch = () => {
		return <PanelSearch />;
	};

	renderPanelToggle = panelOpen => {
		const {togglePanel} = this.props;

		const classNames = cn({
			[styles.panelButton]: true,
			[styles.panelButtonShow]: !panelOpen
		});

		return (
			<div className={classNames} onClick={togglePanel}>
				<PanelIcon />
			</div>
		);
	};

	render () {
		const {panelOpen} = this.props;

		if (panelOpen) {
			return (
				<div className={styles.panelWrap}>
					<div className={styles.panelContainer}>
						{this.renderPanelHeader()}
						{this.renderPanelSearch()}
						{this.renderPanelContent()}
					</div>
					{this.renderPanelToggle(panelOpen)}
				</div>
			);
		} else {
			return (
				<div className={styles.panelWrap}>
					{this.renderPanelToggle(panelOpen)}
				</div>
			);
		}
	}
}

export default connect(props, functions)(Panel);
