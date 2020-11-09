// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import WidgetAddPanel from 'containers/WidgetAddPanel';
import WidgetEditForm from 'containers/WidgetEditForm';

export class DashboardPanel extends PureComponent<Props> {
	renderContent = () => {
		const {selectedWidget} = this.props;
		const content = selectedWidget ? <WidgetEditForm key={selectedWidget} /> : <WidgetAddPanel />;

		return (
			<div className={styles.content}>
				{content}
			</div>
		);
	};

	renderDrawerControl = () => {
		const {onToggleSwipe, swiped} = this.props;
		const CN = cn({
			[styles.drawerControl]: true,
			[styles.activeDrawerControl]: swiped
		});

		return (
			<div className={CN} onClick={onToggleSwipe}>
				<Icon className={styles.drawerIcon} name={ICON_NAMES.DRAWER} />
			</div>
		);
	};

	render () {
		const {swiped} = this.props;
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
