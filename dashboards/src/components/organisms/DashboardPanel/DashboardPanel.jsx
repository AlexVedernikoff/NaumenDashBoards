// @flow
import cn from 'classnames';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent, Suspense} from 'react';
import styles from './styles.less';

const WidgetAddPanel = React.lazy(() => import('containers/WidgetAddPanel'));
const WidgetFormPanel = React.lazy(() => import('containers/WidgetFormPanel'));

export class DashboardPanel extends PureComponent<Props> {
	handleToggle = () => {
		const {swiped, updateSwiped} = this.props;
		return updateSwiped(!swiped);
	};

	renderContent = () => {
		const {selectedWidget} = this.props;
		const content = selectedWidget ? <WidgetFormPanel key={selectedWidget} /> : <WidgetAddPanel />;

		return (
			<div className={styles.content}>
				<Suspense fallback={this.renderFallback()}>
					{content}
				</Suspense>
			</div>
		);
	};

	renderDrawerControl = () => {
		const {swiped} = this.props;
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

	renderFallback = () => {
		return (
			<div className={styles.fallback}>Загрузка...</div>
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
