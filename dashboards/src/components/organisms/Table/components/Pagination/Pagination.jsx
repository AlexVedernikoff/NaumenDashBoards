// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Pagination extends PureComponent<Props> {
	renderCenter = () => {
		const {page, total} = this.props;

		return (
			<div className={styles.center}>
				<span>Страница {page} из {total}</span>
			</div>
		);
	};

	renderNextButton = () => {
		const {onNextClick, page, total} = this.props;
		const disabled = page === total;

		return (
			<button className={styles.button} disabled={disabled} onClick={onNextClick}>
				Следующая
			</button>
		);
	};

	renderPrevButton = () => {
		const {onPrevClick, page} = this.props;
		const disabled = page === 1;

		return (
			<button className={styles.button} disabled={disabled} onClick={onPrevClick}>
				Предыдущая
			</button>
		);
	};

	render () {
		const {width: minWidth} = this.props;

		return (
			<div className={styles.container} style={{minWidth}}>
				{this.renderPrevButton()}
				{this.renderCenter()}
				{this.renderNextButton()}
			</div>
		);
	}
}

export default Pagination;
