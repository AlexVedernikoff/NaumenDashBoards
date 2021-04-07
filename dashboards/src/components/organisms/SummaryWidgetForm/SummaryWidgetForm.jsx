// @flow
import DiagramWidgetForm from 'containers/DiagramWidgetForm';
import ParamsTab from './components/ParamsTab';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import {DEFAULT_LAYOUT_SIZE, schema} from './constants';
import StyleTab from './components/StyleTab';
import {WIDGET_TYPES} from 'store/widgets/data/constants';
import NewWidget from 'store/widgets/data/NewWidget';
import {getCountGridColumns} from 'components/organisms/WidgetsGrid/helpers';
import {GRID_LAYOUT_HEIGHT} from 'components/organisms/WidgetsGrid/constants';
import {DEFAULT_WIDGET_LAYOUT_SIZE} from 'store/dashboard/layouts/constants';
import type {Layout} from 'store/dashboard/layouts/types';

export class SummaryWidgetForm extends PureComponent<Props> {
	components = {
		ParamsTab,
		StyleTab
	};

	componentDidMount () {
		const layoutSize = this.getSummaryLayoutSize();

		this.setLayoutSize(layoutSize);
	}

	componentWillUnmount () {
		this.setLayoutSize(DEFAULT_WIDGET_LAYOUT_SIZE);
	}

	getSummaryLayoutSize = () => {
		const {layoutMode} = this.props;
		const {height, width} = DEFAULT_LAYOUT_SIZE;
		const h = Math.round(height / GRID_LAYOUT_HEIGHT);
		const w = Math.ceil(width / window.innerWidth * getCountGridColumns(layoutMode));

		return {
			h,
			w
		};
	};

	handleSubmit = (values) => {
		const {onSave, widget} = this.props;
		const {id} = widget;

		onSave({...values, id, type: WIDGET_TYPES.SUMMARY});
	};

	setLayoutSize = (layoutSize: $Shape<Layout>) => {
		const {layoutMode, onChangeLayout, widget} = this.props;
		const layout = {
			...layoutSize,
			i: widget.id
		};

		widget instanceof NewWidget && onChangeLayout({layout, layoutMode});
	};

	render () {
		const {onChange, values} = this.props;

		return (
			<DiagramWidgetForm
				components={this.components}
				onChange={onChange}
				onSubmit={this.handleSubmit}
				schema={schema}
				values={values}
			/>
		);
	}
}

export default SummaryWidgetForm;
