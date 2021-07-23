// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import WidgetAddPanel from 'containers/WidgetAddPanel';
import WidgetFormPanel from 'containers/WidgetFormPanel';

export class DashboardPanel extends PureComponent<Props, State> {
	state = {
		swiped: false
	};

	componentDidUpdate (prevProps: Props) {
		const {selectedWidget} = this.props;
		const {selectedWidget: prevSelectedWidget} = prevProps;

		if ((!prevSelectedWidget && selectedWidget) || selectedWidget !== prevSelectedWidget) {
			this.setState({swiped: false});
		}
	}

	handleToggle = () => this.setState({swiped: !this.state.swiped});

	renderContent = () => {
		const {selectedWidget} = this.props;
		const content = selectedWidget ? <WidgetFormPanel key={selectedWidget} /> : <WidgetAddPanel />;

		return (
			<div className={styles.content}>
				{content}
			</div>
		);
	};

	renderDrawerControl = () => {
		const {swiped} = this.state;
		const CN = cn({
			[styles.drawerControl]: true,
			[styles.activeDrawerControl]: swiped
		});

		return (
			<div className={CN} onClick={this.handleToggle}>
				<Icon className={styles.drawerIcon} name={ICON_NAMES.DRAWER} />
			</div>
		);
	};

	render () {
		const {swiped} = this.state;
		const CN = cn({
			[styles.container]: true,
			[styles.swipedContainer]: swiped
		});

		return (
			<div className={CN}>
				{this.renderDrawerControl()}
				{this.renderContent()}
			</div>
		);
	}
}

export default DashboardPanel;
