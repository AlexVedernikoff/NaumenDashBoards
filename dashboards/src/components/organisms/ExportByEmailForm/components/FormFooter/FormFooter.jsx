// @flow
import Button, {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class FormFooter extends PureComponent<Props> {
	renderResetButton = () => {
		const {onReset} = this.props;

		return (
			<Button className={styles.button} onClick={onReset} variant={BUTTON_VARIANTS.ADDITIONAL}>
				<T text='ExportByEmailForm::FormFooter::Reset' />
			</Button>
		);
	};

	renderSendButton = () => {
		const {nothingSelected, onSend, sending} = this.props;
		const disabled = sending || nothingSelected;

		return (
			<Button className={styles.button} disabled={disabled} onClick={onSend}>
				<T text='ExportByEmailForm::FormFooter::Send' />
			</Button>
		);
	};

	render () {
		return (
			<div className={styles.footer}>
				{this.renderSendButton()}
				{this.renderResetButton()}
			</div>
		);
	}
}

export default FormFooter;
