// @flow
import type {AxisWidget, CircleWidget} from 'store/widgets/data/types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {functions} from './selectors';
import type {InjectedProps, Props} from './types';
import React from 'react';

export const withChartColorsSettingsSaving = <Config: {} & InjectedProps>(Component: React$ComponentType<Config>): React$ComponentType<Config> => {
	return class WrappedComponent extends React.Component<Config & Props> {
		save = (widget: AxisWidget | CircleWidget) => {
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
