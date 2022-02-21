// @flow
import Button from 'components/atoms/Button';
import Modal from 'components/molecules/Modal';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {SIZES as MODAL_SIZES} from 'components/molecules/Modal/constants';
import styles from './styles.less';
import t from 'localization';
import T from 'components/atoms/Translation';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

class SelectModal extends PureComponent<Props> {
	renderFooter = () => {
		const {onClose} = this.props;

		return (
			<div className={styles.footer}>
				<Button onClick={onClose} variant={BUTTON_VARIANTS.ADDITIONAL}>
					<T text="SelectModal::Cancel" />
				</Button>
			</div>
		);
	};

	render () {
		const {children} = this.props;

		return (
			<Modal header={t('SelectModal::CreateField')} renderFooter={this.renderFooter} size={MODAL_SIZES.LARGE}>
				<div className={styles.container}>
					{children}
				</div>
			</Modal>
		);
	}
}

export default SelectModal;
