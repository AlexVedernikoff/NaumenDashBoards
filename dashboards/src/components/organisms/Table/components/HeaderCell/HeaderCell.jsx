// @flow
import {Cell} from 'components/organisms/Table/components';
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
		const {columnIndex, onClick} = this.props;
		onClick(columnIndex);
	};

	handleClickResizer = (event: SyntheticMouseEvent<HTMLDivElement>) => event.stopPropagation();

	mouseDown = (event: MouseEvent) => {
		const {width} = this.props;
		this.cursorStart = event.pageX;
		this.resizerOffset = width;
		this.dragStart = true;

		event.stopPropagation();
	};

	mouseMove = (event: MouseEvent) => {
		if (this.dragStart) {
			const {columnIndex, onChangeWidth} = this.props;
			const newWidth = Math.floor(Math.max(this.resizerOffset + event.pageX - this.cursorStart, MIN_WIDTH));

			onChangeWidth(newWidth, columnIndex);
		}
	};

	mouseUp = () => {
		this.dragStart = false;
	};

	renderResizer = () => <div className={styles.resizer} onClick={this.handleClickResizer} ref={this.ref} />;

	render () {
		const {column, fontColor, fontStyle, sorting, value, width} = this.props;
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
				column={column}
				fontColor={fontColor}
				fontStyle={fontStyle}
				onClick={this.handleClick}
				textAlign={TEXT_ALIGNS.center}
				tip={value}
				value={value}
				width={width}
			>
				{this.renderResizer()}
			</Cell>
		);
	}
}

export default HeaderCell;
