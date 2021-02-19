// @flow
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import styles from './styles.less';

export class FormHeader extends PureComponent<Props> {
	renderAddUserButton = () => {
		const {onAddUser} = this.props;
		return <IconButton icon={ICON_NAMES.PLUS} onClick={onAddUser} round={false} tip="Добавить получателя" />;
	};

	renderFormatSelect = () => {
		const {format, formatOptions, onSelectFormat} = this.props;
		return <Select className={styles.formatSelect} onSelect={onSelectFormat} options={formatOptions} value={format} />;
	};

	render () {
		return (
			<div className={styles.header}>
				{this.renderFormatSelect()}
				{this.renderAddUserButton()}
			</div>
		);
	}
}

export default FormHeader;
