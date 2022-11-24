// @flow
import BaseWidget from 'containers/Widget';
import type {ComponentProps, ComponentState, InjectOptionsProps, WidgetProps} from './types';
import {connect} from 'react-redux';
import Content from './components/Content';
import type {DivRef} from 'components/types';
import {functions, props} from './selectors';
import {getOptions} from 'utils/recharts';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';

export const withBaseWidget = <Config: WidgetProps>(
	Component: React$ComponentType<Config & InjectOptionsProps>
): React$ComponentType<Config> => {
	class WithBaseWidget extends PureComponent<Config & ComponentProps, ComponentState> {
		state = {
			height: 0,
			hiddenSeries: [],
			options: {},
			updateError: false,
			width: 0
		};

		widgetRef: DivRef = createRef();

		static getDerivedStateFromProps (props: Config & ComponentProps, state: ComponentState) {
			const {buildData, globalColorsSettings, widget} = props;
			const {height, width} = state;
			const {data, error, loading} = buildData;

			if (!error && !loading && data) {
				try {
					const containerSize = {height, width};

					const options = width > 0 && height > 0
						? getOptions(widget, data, containerSize, globalColorsSettings)
						: {};

					return {options, updateError: false};
				} catch (ex) {
					if (process.env.NODE_ENV === 'development') {
						console.error(ex);
					}

					return {updateError: true};
				}
			}

			return null;
		}

		componentDidMount () {
			const {buildData, fetchBuildData, widget} = this.props;
			const {data, error, loading} = buildData;

			if (!error || !loading || !data) {
				fetchBuildData(widget);
			}
		}

		handleToggleSeriesShow = (seriesName: string) => this.setState(({hiddenSeries: oldHiddenSeries}) => {
			let hiddenSeries;

			if (oldHiddenSeries.includes(seriesName)) {
				hiddenSeries = oldHiddenSeries.filter(series => series !== seriesName);
			} else {
				hiddenSeries = [...oldHiddenSeries, seriesName];
			}

			return {hiddenSeries};
		});

		updateOptions = (container: HTMLDivElement) => {
			const {height, width} = container.getBoundingClientRect();
			return this.setState({height, width});
		};

		renderContent = () => {
			const {buildData: {data, error, loading}, drillDown, setWidgetWarning, ...props} = this.props;
			const {widget} = props;
			const {hiddenSeries, options, updateError} = this.state;

			if (!error && !updateError && !loading && options) {
				return (
					<Content widget={widget}>
						<Component
							{...props}
							data={data}
							drillDown={drillDown}
							hiddenSeries={hiddenSeries}
							options={options}
							setWidgetWarning={setWidgetWarning}
							toggleSeriesShow={this.handleToggleSeriesShow}
							updateOptions={this.updateOptions}
						/>
					</Content>
				);
			}

			return null;
		};

		renderError = () => {
			const {buildData: {error}} = this.props;
			const {updateError} = this.state;

			if (error) {
				return <div className={styles.error} title={error}>{error}</div>;
			}

			if (updateError) {
				return (
					<div className={styles.error} title={t('Widget::Error')}>
						<T text='Widget::Error' />
					</div>
				);
			}

			return null;
		};

		renderLoading = () => {
			const {buildData: {loading}} = this.props;
			const {options} = this.state;

			if (loading && (!options || !options.type || options.type === 'EmptyChartOptions')) {
				return (<div className={styles.loading}><T text="LoadingContent::Loading" /></div>);
			}

			return null;
		};

		render () {
			const {widget} = this.props;

			return (
				<BaseWidget className={styles.widget} forwardedRef={this.widgetRef} widget={widget}>
					{this.renderError()}
					{this.renderLoading()}
					{this.renderContent()}
				</BaseWidget>
			);
		}
	}

	return connect(props, functions)(WithBaseWidget);
};

export default withBaseWidget;
