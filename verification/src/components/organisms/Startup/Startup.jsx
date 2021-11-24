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
			errorVerification,
			loadingAttributes,
			loadingSetting,
			loadingVerification
		} = this.props;

		if (loadingAttributes || loadingSetting || loadingVerification) {
			return <p>Загрузка данных</p>;
		}

		if (errorSetting) {
			return <p>Ошибка загрузки стартовых данных<br />${errorSetting}</p>;
		}

		if (errorAttributes) {
			return <p>Ошибка загрузки атрибутов проверок<br />${errorAttributes}</p>;
		}

		if (errorVerification) {
			return <p>Ошибка верификации проверки<br />${errorVerification}</p>;
		}

		return (
			<div className={styles.container}>
				{children}
			</div>
		);
	}
}

export default Startup;
