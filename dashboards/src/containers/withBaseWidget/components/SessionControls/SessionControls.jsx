// @flow
import {AGGREGATION_TYPE, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {AxisWidget} from 'store/widgets/data/types';
import Button from 'components/atoms/Button';
import cn from 'classnames';
import {hasCountPercent} from 'store/widgets/helpers';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import {VARIANTS as BUTTON_VARIANTS} from 'components/atoms/Button/constants';

export class SessionControls extends PureComponent<Props> {
	getChangeAggregationTypeHandler = aggregationType => e => {
		const {updateWidget, widget} = this.props;

		e.stopPropagation();

		return updateWidget({aggregationType, id: widget.id});
	};

	renderCntPercentType = () => {
		const {widget} = this.props;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED} = WIDGET_TYPES;

		if (
			widget.type === BAR
			|| widget.type === BAR_STACKED
			|| widget.type === COLUMN
			|| widget.type === COLUMN_STACKED
		) {
			const axisWidget: AxisWidget = widget;
			const {aggregationType = AGGREGATION_TYPE.PERCENT_CNT_BY_COMMON, data} = axisWidget;
			const mainDataSet = data.find(data => !data.sourceForCompute);
			const {aggregation = '', attribute = null} = mainDataSet?.indicators?.[0] ?? {};

			if (hasCountPercent(attribute, aggregation)) {
				let byWidgetClass = styles.button;
				let byParametersClass = styles.button;
				let byWidgetVariant = BUTTON_VARIANTS.GRAY;
				let byParametersVariant = BUTTON_VARIANTS.GRAY;

				if (aggregationType === AGGREGATION_TYPE.PERCENT_CNT_BY_COMMON) {
					byWidgetClass = cn(styles.button, styles.activeButton);
					byWidgetVariant = BUTTON_VARIANTS.INFO;
				} else {
					byParametersClass = cn(styles.button, styles.activeButton);
					byParametersVariant = BUTTON_VARIANTS.INFO;
				}

				return (
					<div className={styles.cntPercent}>
						<Button
							className={byWidgetClass}
							onClick={this.getChangeAggregationTypeHandler(AGGREGATION_TYPE.PERCENT_CNT_BY_COMMON)}
							tooltip={t('SessionControls::ByWidgetClassTooltip')}
							variant={byWidgetVariant}
						>
							<T text="SessionControls::ByWidgetClass" />
						</Button>
						<Button
							className={byParametersClass}
							onClick={this.getChangeAggregationTypeHandler(AGGREGATION_TYPE.PERCENT_CNT_BY_PARAMETERS)}
							tooltip={t('SessionControls::ByParametersClassTooltip')}
							variant={byParametersVariant}
						>
							<T text="SessionControls::ByParametersClass" />
						</Button>
					</div>
				);
			}
		}

		return null;
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderCntPercentType()}
			</div>
		);
	}
}

export default SessionControls;
