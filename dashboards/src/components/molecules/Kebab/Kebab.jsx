// @flow
import cn from 'classnames';
import {FORCE_TO_SHOW_CONTEXT} from './constants';
import {ICON_NAMES} from 'components/atoms/Icon';
import KebabIconButton from './components/KebabIconButton';
import memoize from 'memoize-one';
import OutsideClickDetector from 'components/atoms/OutsideClickDetector';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import ResizeDetector from 'components/molecules/ResizeDetector';
import styles from './styles.less';
import t from 'localization';

export class Kebab extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		activeKebab: false,
		elements: 0,
		forceShow: false,
		showKebab: true,
		width: 24
	};

	getChildren = memoize(children => {
		let result = [];

		if (children) {
			if (Array.isArray(children)) {
				const childernsWithFragments = children.filter(Boolean);

				childernsWithFragments.forEach(element => {
					const isFragment = (element.type && element.type === React.Fragment) || element === React.Fragment;

					if (isFragment && element.props?.children) {
						const {children: elementChildren} = element.props;

						if (Array.isArray(elementChildren)) {
							elementChildren.forEach(fragmentElement => result.push(fragmentElement));
						} else {
							result.push(elementChildren);
						}
					} else {
						result.push(element);
					}
				});
			} else {
				result = [children];
			}
		}

		return result;
	});

	forceToShow = (force: boolean) => {
		this.setState({forceShow: force});
	};

	handleResize = (placeWidth, height) => {
		const children = this.getChildren(this.props.children);
		const buttonPlaceWidth = placeWidth - 8;
		const availableButtonsCount = Math.max(Math.floor(buttonPlaceWidth / 28), 1);
		const kebabElementsCount = children.length;
		const showKebab = kebabElementsCount > availableButtonsCount;
		const elements = showKebab ? availableButtonsCount - 1 : kebabElementsCount;
		const width = showKebab ? (elements + 1) * 28 - 4 : elements * 28 - 4;

		this.setState({
			activeKebab: false,
			elements,
			showKebab,
			width
		});
	};

	toggleActiveKebab = () => this.setState(({activeKebab}) => ({activeKebab: !activeKebab}));

	renderElements = () => {
		const children = this.getChildren(this.props.children);
		const {activeKebab, elements, showKebab} = this.state;
		let result = children.slice(0, elements);

		if (showKebab) {
			result.push(
				<KebabIconButton active={activeKebab} icon={ICON_NAMES.KEBAB} key={'menu'} onClick={this.toggleActiveKebab} text={t('Kebab::Menu')} />
			);
		}

		if (activeKebab) {
			result = [...result, ...children.slice(elements)];
		}

		return result;
	};

	renderKebabPlace = () => {
		const {forceShow, width} = this.state;
		const className = cn(styles.kebabPlace, {
			[styles.kebabPlaceForceShow]: forceShow
		});
		return (
			<div className={className} style={{width}}>
				{this.renderElements()}
			</div>
		);
	};

	renderKebabPlaceHandle = () => {
		const {activeKebab} = this.state;

		if (activeKebab) {
			return (
				<OutsideClickDetector onClickOutside={this.toggleActiveKebab}>
					{this.renderKebabPlace()}
				</OutsideClickDetector>
			);
		} else {
			return this.renderKebabPlace();
		}
	};

	render () {
		const {className} = this.props;
		const cls = cn(className, styles.kebab);
		return (
			<FORCE_TO_SHOW_CONTEXT.Provider value={this.forceToShow}>
				<ResizeDetector onResize={this.handleResize} skipOnMount={false}>
					<div className={cls}>
						{this.renderKebabPlaceHandle()}
					</div>
				</ResizeDetector>
			</FORCE_TO_SHOW_CONTEXT.Provider>
		);
	}
}

export default Kebab;
