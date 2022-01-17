// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class Pagination extends PureComponent<Props> {
	renderCenter = () => {
		const {page, total} = this.props;

		return (
			<div className={styles.center}>
				<span><T page={page} text="Table::Paginator::PageNumber" total={total} /></span>
			</div>
		);
	};

	renderNextButton = () => {
		const {onNextClick, page, total} = this.props;
		const disabled = page === total;

		return (
			<button className={styles.button} disabled={disabled} onClick={onNextClick}>
				<T text="Table::Paginator::Next" />
			</button>
		);
	};

	renderPrevButton = () => {
		const {onPrevClick, page} = this.props;
		const disabled = page === 1;

		return (
			<button className={styles.button} disabled={disabled} onClick={onPrevClick}>
				<T text="Table::Paginator::Previous" />
			</button>
		);
	};

	render () {
		const {width} = this.props;

		return (
			<div className={styles.container} style={{width}}>
				{this.renderPrevButton()}
				{this.renderCenter()}
				{this.renderNextButton()}
			</div>
		);
	}
}

export default Pagination;
