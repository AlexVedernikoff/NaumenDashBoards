// @flow
import type {Chart, ComboWidget, DataTopSettings, TableWidget} from 'store/widgets/data/types';
import cn from 'classnames';
import {
	FONT_STYLES,
	MODE_OF_TOP,
	TEXT_HANDLERS,
	WIDGET_SETS,
	WIDGET_TYPES
} from 'store/widgets/data/constants';
import type {Props} from './types';
import React, {createRef, PureComponent} from 'react';
import type {Ref} from 'components/types';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import T from 'components/atoms/Translation';
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

		if (widget) {
			if (
				widget.type in WIDGET_SETS.AXIS
				|| widget.type in WIDGET_SETS.CIRCLE
			) {
				// $FlowFixMe
				const chartWidget: Chart = widget;
				const mainDataSet = chartWidget.data.find(ds => !ds.sourceForCompute);

				if (mainDataSet && mainDataSet.top) {
					return this.renderTopElement(mainDataSet.top ?? {show: false});
				}
			} else if (widget.type === WIDGET_TYPES.COMBO) {
				const comboWidget: ComboWidget = widget;
				const tops = [];

				comboWidget.data.forEach(ds => {
					if (!ds.sourceForCompute) {
						tops.push(ds.top);
					}
				});

				if (tops.length) {
					const show = tops.some(top => top.show);
					const firstCount = tops[0].count;
					const isEqualsCount = tops.every(top => top.count === firstCount);
					const count = isEqualsCount ? firstCount : null;

					return this.renderTopElement({count, modeOfTop: MODE_OF_TOP.MAX, show});
				}
			} else if (widget.type === WIDGET_TYPES.TABLE) {
				const tableWidget: TableWidget = widget;

				return this.renderTopElement(tableWidget.top);
			}
		}

		return null;
	};

	renderTopElement = (top: DataTopSettings) => {
		if (top.show) {
			return (
				<div className={styles.top}>
					<T count={top.count ?? ''} text="Header::Top" />
				</div>
			);
		}

		return null;
	};

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
