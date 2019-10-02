// @flow
import {Button, DropDownFiles} from 'components/atoms';
import {createSnapshot} from 'utils/export';
import {FILE_VARIANTS} from 'components/atoms/DropDownFiles/constansts.js';
import IconRefrashe from 'icons/header/refresh.svg';
import React, {Component} from 'react';
import type {Props} from 'containers/DashboardHeader/types';
import styles from './styles.less';

export class DashboardHeader extends Component<Props> {
	createDocument = (docStr: string) => {
		const {name} = this.props;
		createSnapshot(name, docStr);
	};

	renderModeButton = () => {
		const {editDashboard, isEditable, seeDashboard} = this.props;

		if (isEditable) {
			return <Button type="button" onClick={seeDashboard}>Просмотреть</Button>;
		}

		return <Button type="button" onClick={editDashboard} >Редактировать</Button>;
	};

	renderButtonRefresh = () => {
		const {fetchDashboard} = this.props;

		return <Button type="button" variant="icon" onClick={fetchDashboard}><IconRefrashe /></Button>;
	};

	renderDropDown = () => {
		return <DropDownFiles icon list={[{text: FILE_VARIANTS.PDF}, {text: FILE_VARIANTS.PNG}]} createDoc={this.createDocument}/>;
	};

	render () {
		const {name} = this.props;

		return (
			<header className={styles.header}>
				<p className={styles.title}>Дашборд {`"${name}"`}</p>
				<ul className={styles.nav}>
					<li className={styles.navItem}>
						<div className={styles.button}>
							{this.renderDropDown()}
						</div>
						<div className={styles.button}>
							{this.renderButtonRefresh()}
						</div>
						{this.renderModeButton()}
					</li>
				</ul>
			</header>
		);
	}
}

export default DashboardHeader;
