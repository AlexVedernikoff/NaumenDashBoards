// @flow
import Button from 'components/atoms/Button';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

class SelectItem extends PureComponent<Props> {
	render () {
		const {onClick, text} = this.props;

		return (
			<div className={styles.element}>
				<Button className={styles.button} onClick={onClick} variant={BUTTON_VARIANTS.GRAY}>&nbsp;</Button>
				<T text={text} />
			</div>
		);
	}
}

export default SelectItem;
