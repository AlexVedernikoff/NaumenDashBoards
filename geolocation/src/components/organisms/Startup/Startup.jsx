// @flow
import React, {Component} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import styles from './Startup.less';
import type {Props} from 'containers/Startup/types';
import CloseIcon from 'icons/CloseIcon';

const CloseButton = ({closeToast}: Object) => (
	<div className={styles.closeIcon} onClick={closeToast}>
		<CloseIcon />
	</div>
);

export class Startup extends Component<Props> {
	componentDidMount () {
		const {fetchGeolocation} = this.props;

		fetchGeolocation();
	}

	render () {
		const {children, error, success, loading} = this.props;

		if (error) {
			return <p>Ошибка загрузки карты</p>;
		}

		if (loading) {
			return <p>Загрузка...</p>;
		}

		if (success) {
			return (
				<div>
					<ToastContainer
						position="bottom-right"
						closeButton={<CloseButton />}
						className={styles.toastContainer}
						hideProgressBar
						newestOnTop={false}
						closeOnClick={false}
						rtl={false}
						pauseOnVisibilityChange
						draggable={false}
						pauseOnHover
					/>
					{children}
				</div>
			);
		}

		return <div/>;
	}
}

export default Startup;
