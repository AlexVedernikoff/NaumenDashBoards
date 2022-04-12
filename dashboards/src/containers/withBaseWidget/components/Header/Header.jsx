// @flow
import cn from 'classnames';
import {FONT_STYLES, TEXT_HANDLERS} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import settingsStyles from 'styles/settings.less';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

export class Header extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		position: null
	};

	headerRef: Ref<'div'> = createRef();

	componentDidMount () {
		this.props.onChangeHeight(this.headerRef.current?.clientHeight ?? 0);
	}

	handleClearTooltip = () => this.setState({position: null});

	handleTooltipShow = ({clientX: x, clientY: y}: MouseEvent) => {
		this.setState({position: {x, y}});
	};

	render () {
		const {className, settings, tooltip, widgetName} = this.props;
		const {position} = this.state;
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
			<div className={nameCN}
				onMouseEnter={this.handleTooltipShow}
				onMouseLeave={this.handleClearTooltip}
				ref={this.headerRef}
				style={style}
			>
				{useName ? widgetName : name}
				<WidgetTooltip position={position} tooltip={tooltip} />
			</div>
		);
	}
}

export default Header;
