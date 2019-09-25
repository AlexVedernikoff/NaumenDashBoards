// @flow
import {Button} from 'components/atoms';
import type {Props} from 'containers/DashboardHeader/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class DashboardHeader extends Component<Props> {
	renderButton = () => {
		const {isEditable, editDashboard, seeDashboard} = this.props;

		if (isEditable) {
			return <Button type="button" onClick={seeDashboard}>Просмотреть</Button>;
		}

		return <Button type="button" onClick={editDashboard} >Редактировать</Button>;
	};

	render () {
		const {name} = this.props;

		return (
			<header className={styles.header}>
				<p className={styles.title}>Дашборд {`"${name}"`}</p>
				<ul className={styles.nav}>
					<li className={styles.navItem}>
						{this.renderButton()}
					</li>
				</ul>
			</header>
		);
	}
}

export default DashboardHeader;
