// @flow
import BaseWidget from 'containers/Widget';
import type {ComponentProps, ComponentState, InjectOptionsProps, WidgetProps} from './types';
import {connect} from 'react-redux';
import Content from './components/Content';
import type {DivRef} from 'components/types';
import {functions, props} from './selectors';
import {getOptions} from 'utils/recharts';
import React, {createRef, Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export const withBaseWidget = <Config: WidgetProps>(
	Component: React$ComponentType<Config & InjectOptionsProps>
): React$ComponentType<Config> => {
	class WithBaseWidget extends PureComponent<Config & ComponentProps, ComponentState> {
		state = {
			container: null,
			options: {}
		};

		widgetRef: DivRef = createRef();

		static getDerivedStateFromProps (props: Config & ComponentProps, state: ComponentState) {
			const {buildData, globalColorsSettings, widget} = props;
			const {container} = state;
			const {data, error, loading} = buildData;

			if (!error && !loading && data) {
				const options = container
					? getOptions(widget, data, container, globalColorsSettings)
					: {};

				return {options};
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

		updateOptions = (container: HTMLDivElement) => this.setState({container});

		renderContent = () => {
			const {buildData: {data, error, loading}, drillDown, setWidgetWarning, ...props} = this.props;
			const {widget} = props;
			const {options} = this.state;

			if (!error && !loading && options) {
				return (
					<BaseWidget className={styles.widget} forwardedRef={this.widgetRef} widget={widget}>
						<Content widget={widget}>
							<Component
								{...props}
								data={data}
								drillDown={drillDown}
								options={options}
								setWidgetWarning={setWidgetWarning}
								updateOptions={this.updateOptions}
							/>
						</Content>
					</BaseWidget>
				);
			}

			return null;
		};

		renderError = () => {
			const {buildData: {error}} = this.props;
			return error ? <div className={styles.error} title={error}>{error}</div> : null;
		};

		renderLoading = () => {
			const {buildData: {loading}} = this.props;
			const {options} = this.state;

			if (loading && (!options || !options.type || options.type === 'EmptyChartOptions')) {
				return (<p className={styles.loading}><T text="LoadingContent::Loading" /></p>);
			}

			return null;
		};

		render () {
			return (
				<Fragment>
					{this.renderError()}
					{this.renderLoading()}
					{this.renderContent()}
				</Fragment>
			);
		}
	}

	return connect(props, functions)(WithBaseWidget);
};

export default withBaseWidget;
