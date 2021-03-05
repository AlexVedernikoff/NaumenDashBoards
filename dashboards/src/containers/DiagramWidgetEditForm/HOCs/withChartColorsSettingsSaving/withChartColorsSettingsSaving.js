// @flow
import type {AnyWidget, Chart} from 'store/widgets/data/types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {functions} from './selectors';
import type {InjectedProps, Props} from './types';
import React from 'react';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export const withChartColorsSettingsSaving = <Config: {} & InjectedProps>(Component: React$ComponentType<Config>): React$ComponentType<Config> => {
	return class WrappedComponent extends React.Component<Config & Props> {
		save = (widget: AnyWidget) => {
			const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, DONUT, PIE} = WIDGET_TYPES;

			switch (widget.type) {
				case BAR:
				case BAR_STACKED:
				case COLUMN:
				case COLUMN_STACKED:
				case DONUT:
				case PIE:
					this.saveChartSettings(widget);
			}
		};

		saveChartSettings = (widget: Chart) => {
			const {saveCustomChartColorsSettings, setUseGlobalChartSettings} = this.props;
			const {colorsSettings} = widget;
			const {data, useGlobal} = colorsSettings.custom;

			if (useGlobal && data) {
				const {key} = data;

				saveCustomChartColorsSettings(data);
				setUseGlobalChartSettings(key, useGlobal, widget.id);
			}
		};

		render () {
			return <Component {...this.props} saveCustomColorsSettings={this.save} />;
		}
	};
};

export default compose(connect(null, functions), withChartColorsSettingsSaving);
