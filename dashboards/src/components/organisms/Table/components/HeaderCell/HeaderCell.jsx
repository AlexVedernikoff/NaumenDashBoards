// @flow
import {Cell} from 'components/organisms/Table/components/index';
import cn from 'classnames';
import {MIN_WIDTH} from './constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import {SORTING_TYPES, TEXT_ALIGNS} from 'store/widgets/data/constants';
import styles from './styles.less';

export class HeaderCell extends PureComponent<Props> {
	ref: Ref<'div'> = createRef();
	dragStart = false;
	resizerOffset: number;
	cursorStart: number;

	componentDidMount () {
		const {current: resizer} = this.ref;

		if (resizer) {
			document.addEventListener('mousemove', this.mouseMove);
			document.addEventListener('mouseup', this.mouseUp);
			resizer.addEventListener('mousedown', this.mouseDown);
		}
	}

	componentWillUnmount () {
		const {current: resizer} = this.ref;

		if (resizer) {
			document.removeEventListener('mousemove', this.mouseMove);
			document.removeEventListener('mouseup', this.mouseUp);
			resizer.removeEventListener('mousedown', this.mouseDown);
		}
	}

	handleClick = () => {
		const {index, onClick} = this.props;
		onClick(index);
	}

	handleClickResizer = (event: SyntheticMouseEvent<HTMLDivElement>) => event.stopPropagation();

	mouseDown = (event: MouseEvent) => {
		const {width} = this.props;
		this.cursorStart = event.pageX;
		this.resizerOffset = width;
		this.dragStart = true;

		event.stopPropagation();
	}

	mouseMove = (event: MouseEvent) => {
		if (this.dragStart) {
			const {index, onChangeWidth} = this.props;
			const newWidth = Math.floor(Math.max(this.resizerOffset + event.pageX - this.cursorStart, MIN_WIDTH));

			onChangeWidth(newWidth, index);
		}
	}

	mouseUp = () => {
		const {index, onFinishedChangeWidth} = this.props;

		if (this.dragStart) {
			this.dragStart = false;
			onFinishedChangeWidth(index);
		}
	}

	renderResizer = () => <div className={styles.resizer} onClick={this.handleClickResizer} ref={this.ref} />;

	render () {
		const {fontColor, fontStyle, sorting, value, width} = this.props;
		const {ASC, DESC} = SORTING_TYPES;
		const cellCN = cn({
			[styles.cell]: true,
			[styles.sortAsc]: sorting === ASC,
			[styles.sortDesc]: sorting === DESC
		});

		return (
			<Cell
				body={false}
				className={cellCN}
				fontColor={fontColor}
				fontStyle={fontStyle}
				onClick={this.handleClick}
				textAlign={TEXT_ALIGNS.center}
				value={value}
				width={width}
			>
				{this.renderResizer()}
			</Cell>
		);
	}
}

export default HeaderCell;
