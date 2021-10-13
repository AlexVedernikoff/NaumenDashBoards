// @flow
import AxisChartWidgetForm from 'containers/AxisChartWidgetForm';
import CircleChartWidgetForm from 'containers/CircleChartWidgetForm';
import ComboChartWidgetForm from 'containers/ComboChartWidgetForm';
import memoize from 'memoize-one';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import SpeedometerWidgetForm from 'containers/SpeedometerWidgetForm';
import SummaryWidgetForm from 'containers/SummaryWidgetForm/SummaryWidgetForm';
import TableWidgetForm from 'containers/TableWidgetForm';
import TextWidgetForm from 'containers/TextWidgetForm';
import {TYPE_CONTEXT} from './HOCs/withType/constants';
import {WIDGET_CONTEXT} from './HOCs/withWidget/constants';
import type {WidgetType} from 'store/widgets/data/types';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class WidgetFormPanel extends PureComponent<Props, State> {
	state = {
		initialized: false,
		type: this.props.widget.type
	};

	componentDidCatch (e: Error) {
		const {cancelForm, createToast} = this.props;

		console.error(e);

		createToast({
			text: 'Ошибка формы редактирования',
			type: 'error'
		});
		cancelForm();
	}

	componentDidMount () {
		const {isUserMode, setWidgetUserMode, setWidgetValues, widget} = this.props;

		this.setState({initialized: true});
		widget.id !== NewWidget.id && setWidgetValues(widget);

		if (isUserMode) {
			setWidgetUserMode(widget);
		}
	}

	componentWillUnmount () {
		this.props.resetForm();
	}

	getTypeContextValue = memoize((value: WidgetType) => ({
		onChange: this.handleChangeType,
		value
	}));

	handleChangeType = (type: WidgetType, callback?: () => mixed) => {
		this.setState({type}, callback);
	};

	renderForm = () => {
		const {widget} = this.props;
		const {initialized, type} = this.state;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SPEEDOMETER, SUMMARY, TABLE, TEXT} = WIDGET_TYPES;

		if (!initialized) {
			return null;
		}

		switch (type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case LINE:
				return <AxisChartWidgetForm type={type} widget={widget} />;
			case DONUT:
			case PIE:
				return <CircleChartWidgetForm type={type} widget={widget} />;
			case COMBO:
				return <ComboChartWidgetForm widget={widget} />;
			case SPEEDOMETER:
				return <SpeedometerWidgetForm widget={widget} />;
			case SUMMARY:
				return <SummaryWidgetForm widget={widget} />;
			case TABLE:
				return <TableWidgetForm widget={widget} />;
			case TEXT:
				return <TextWidgetForm widget={widget} />;
			default:
				return null;
		}
	};

	render () {
		const {widget} = this.props;

		return (
			<WIDGET_CONTEXT.Provider value={widget}>
				<TYPE_CONTEXT.Provider value={this.getTypeContextValue(this.state.type)}>
					{this.renderForm()}
				</TYPE_CONTEXT.Provider>
			</WIDGET_CONTEXT.Provider>
		);
	}
}

export default WidgetFormPanel;
