// @flow
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {FONT_SIZE_AUTO_OPTION, FONT_STYLES} from 'store/widgets/data/constants';
import {LoadingDiagramWidget} from 'components/organisms/DiagramWidget';
import type {Props, SpeedometerData, State} from './types';
import React, {createRef, PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import Speedometer from 'components/organisms/Speedometer';
import {speedometerMixin} from 'utils/chart/mixins';
import type {TextValueProps} from 'components/organisms/Speedometer/types';

export class SpeedometerWidget extends PureComponent<Props, State> {
	state = {
		options: null
	};
	containerRef: DivRef = createRef();

	componentDidMount () {
		this.updateOptions();
	}

	componentDidUpdate (prevProps: Props) {
		const {widget} = this.props;

		if (widget !== prevProps.widget) {
			this.updateOptions();
		}
	}

	updateOptions = () => {
		const {widget} = this.props;
		const {current} = this.containerRef;

		if (current) {
			this.setState({
				options: speedometerMixin(widget, current)
			});
		}
	};

	renderSpeedometer = (data: SpeedometerData) => {
		const {options} = this.state;
		const {title, total} = data;
		const components = {
			TextValue: this.renderTextValue
		};
		const value = {...options, title, value: total};

		return (
			<Speedometer
				components={components}
				options={value}
			/>
		);
	};

	renderTextValue = (props: TextValueProps) => {
		const {fontColor, fontFamily, fontSize: indicatorFontSize, fontStyle, show} = this.props.widget.indicator;

		if (show) {
			const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
			const className = cn({
				[settingsStyles.bold]: fontStyle === BOLD,
				[settingsStyles.italic]: fontStyle === ITALIC,
				[settingsStyles.underline]: fontStyle === UNDERLINE
			});
			let {fontSize} = props;

			if (indicatorFontSize !== FONT_SIZE_AUTO_OPTION) {
				fontSize = indicatorFontSize;
			}

			const textProps = {
				...props,
				className,
				fill: fontColor,
				fontFamily,
				fontSize
			};

			return <text {...textProps} />;
		}

		return null;
	};

	render () {
		const {widget} = this.props;

		return (
			<LoadingDiagramWidget forwardedRef={this.containerRef} widget={widget}>
				{data => this.renderSpeedometer(data)}
			</LoadingDiagramWidget>
		);
	}
}

export default SpeedometerWidget;
