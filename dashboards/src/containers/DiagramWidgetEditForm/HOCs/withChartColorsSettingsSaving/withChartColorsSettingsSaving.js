// @flow
import type {ChartColorsSettings} from 'src/store/widgets/data/types';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {DEFAULT_COLORS_SETTINGS} from 'utils/chart/constants';
import {functions} from './selectors';
import type {InjectedProps, Props} from './types';
import React from 'react';

export const withChartColorsSettingsSaving = <Config: {} & InjectedProps>(Component: React$ComponentType<Config>): React$ComponentType<Config> => {
	return class WrappedComponent extends React.Component<Config & Props> {
		save = (settings: ChartColorsSettings = DEFAULT_COLORS_SETTINGS) => {
			const {saveCustomChartColorsSettings, setUseGlobalChartSettings} = this.props;
			const {data, useGlobal} = settings.custom;

			if (useGlobal && data) {
				const {key} = data;

				saveCustomChartColorsSettings(data);
				setUseGlobalChartSettings(key, useGlobal);
			}
		};

		render () {
			return <Component {...this.props} saveCustomColorsSettings={this.save} />;
		}
	};
};

export default compose(connect(null, functions), withChartColorsSettingsSaving);
