// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import styles from './styles.less';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getAttributes, getSetting} = this.props;

		getSetting();
		getAttributes();
	}

	render () {
		const {
			children,
			errorAttributes,
			errorSetting,
			loadingAttributes,
			loadingSetting} = this.props;

		if (loadingAttributes || loadingSetting) {
			return <p>Загрузка данных</p>;
		}

		if (errorSetting) {
			return <p>Ошибка загрузки стартовых настроек</p>;
		}

		if (errorAttributes) {
			return <p>Ошибка загрузки атрибутов проверок</p>;
		}

		return (
			<div className={styles.container}>
				{children}
			</div>
		);
	}
}

export default Startup;
