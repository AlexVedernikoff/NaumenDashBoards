// @flow
import cn from 'classnames';
import {FONT_STYLES, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import settingsStyles from 'styles/settings.less';

export class Header extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	headerRef: Ref<'div'> = createRef();

	componentDidMount () {
		this.props.onChangeHeight(this.headerRef.current?.clientHeight ?? 0);
	}

	render () {
		const {className, settings, widgetName} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle, name, textAlign, textHandler, useName} = settings;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const {CROP, WRAP} = TEXT_HANDLERS;
		const nameCN = cn({
			[className]: true,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE,
			[settingsStyles.crop]: textHandler === CROP,
			[settingsStyles.wrap]: textHandler === WRAP
		});

		const style = {
			color: fontColor,
			fontFamily,
			fontSize: Number(fontSize),
			textAlign
		};

		return (
			<div className={nameCN} ref={this.headerRef} style={style}>
				{useName ? widgetName : name}
			</div>
		);
	}
}

export default Header;
