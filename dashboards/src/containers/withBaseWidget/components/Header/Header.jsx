// @flow
import type {Chart} from 'store/widgets/data/types';
import cn from 'classnames';
import {FONT_STYLES, TEXT_HANDLERS, WIDGET_SETS, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import WidgetTooltip from 'components/molecules/WidgetTooltip';

export class Header extends PureComponent<Props> {
	static defaultProps = {
		className: ''
	};

	headerRef: Ref<'div'> = createRef();

	componentDidMount () {
		this.props.onChangeHeight(this.headerRef.current?.clientHeight ?? 0);
	}

	renderName = () => {
		const {widget} = this.props;
		const {name, useName} = widget.header;

		return useName ? widget.name : name;
	};

	renderTooltip = () => (<WidgetTooltip tooltip={this.props.widget.tooltip} />);

	renderTop = () => {
		const {widget} = this.props;

		if (
			widget
			&& (
				widget.type in WIDGET_SETS.AXIS
				|| widget.type in WIDGET_SETS.CIRCLE
				|| widget.type === WIDGET_TYPES.COMBO
			)
		) {
			// $FlowFixMe
			const chartWidget: Chart = widget;
			const mainDataSet = chartWidget.data.find(ds => !ds.sourceForCompute);

			if (mainDataSet && mainDataSet.top) {
				const {count = 0, show = false} = mainDataSet.top ?? {};

				if (show) {
					return (
						<div className={styles.top}>Топ {count}</div>
					);
				}
			}
		}

		return null;
	};;

	render () {
		const {className, widget} = this.props;
		const {
			fontColor,
			fontFamily,
			fontSize,
			fontStyle,
			textAlign,
			textHandler
		} = widget.header;
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
				{this.renderTop()}
				{this.renderName()}
				{this.renderTooltip()}
			</div>
		);
	}
}

export default Header;
