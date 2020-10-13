// @flow
import cn from 'classnames';
import type {Props, State} from './types';
import React, {Children, PureComponent} from 'react';
import styles from './styles.less';

export class Slider extends PureComponent<Props, State> {
	static defaultProps = {
		size: 3
	};

	state = {
		selectedSlide: 0
	};

	componentDidUpdate (prevProps: Props) {
		const {selectedSlide} = this.state;
		const maxSelectedSlide = this.countSlides() - 1;
		const prevMaxSelectedSlide = this.countSlides(prevProps) - 1;

		if (selectedSlide > maxSelectedSlide) {
			this.setState({selectedSlide: maxSelectedSlide});
		} else if (maxSelectedSlide > prevMaxSelectedSlide) {
			this.setState({selectedSlide: maxSelectedSlide});
		}
	}

	countSlides = (props: Props = this.props) => {
		const {children, size} = props;
		return Math.ceil(Children.count(children) / size);
	};

	getSlides = (): Array<number> => new Array(this.countSlides()).fill('').map((v, i) => i);

	handleClickPaginationBullet = (index: number) => () => this.setState({selectedSlide: index});

	setLastSlideAsActive = () => this.setState({selectedSlide: this.countSlides() - 1});

	renderItems = () => {
		const {children, size} = this.props;
		const {selectedSlide} = this.state;

		return (
			<div className={styles.itemsContainer}>
				{Children.toArray(children).splice(selectedSlide * size, size)}
			</div>
		);
	};

	renderPaginationBullet = (index: number) => {
		const {selectedSlide} = this.state;
		const CN = cn({
			[styles.paginationBullet]: true,
			[styles.selectedPaginationBullet]: index === selectedSlide
		});

		return <div className={CN} onClick={this.handleClickPaginationBullet(index)} />;
	};

	renderPaginationBullets = () => (
		<div className={styles.paginationBulletsContainer}>
			{this.getSlides().map(this.renderPaginationBullet)}
		</div>
	);

	render () {
		const {className} = this.props;

		return (
			<div className={cn(styles.slider, className)}>
				{this.renderItems()}
				{this.renderPaginationBullets()}
			</div>
		);
	}
}

export default Slider;
