// @flow
import {AxisChartForm, CircleChartForm, ComboChartForm, Form, SummaryForm, TableForm} from './components';
import type {DivRef} from 'components/types';
import type {Props, RenderFormProps, State} from './types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export const formRef: DivRef = createRef();

export class WidgetFormPanel extends Component<Props, State> {
	state: {
		rendered: false
	}

	componentDidMount (): * {
		this.setState({rendered: true});
	}

	resolve = () => {
		const {type} = this.props.values;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case LINE:
				return AxisChartForm;
			case COMBO:
				return ComboChartForm;
			case DONUT:
			case PIE:
				return CircleChartForm;
			case SUMMARY:
				return SummaryForm;
			case TABLE:
				return TableForm;
		}
	};

	renderForm = (props: RenderFormProps) => <Form {...this.props} {...props} />;

	renderTypedForm = () => {
		const TypedWidgetForm = this.resolve();
		const {current: container} = formRef;

		if (TypedWidgetForm && container) {
			return <TypedWidgetForm render={this.renderForm} />;
		}
	}

	render () {
		return (
			<div className={styles.form} ref={formRef}>
				{this.renderTypedForm()}
			</div>
		);
	}
}

export default WidgetFormPanel;
