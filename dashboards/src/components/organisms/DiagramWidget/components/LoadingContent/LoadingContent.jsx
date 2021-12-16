// @flow
import Content from 'components/organisms/DiagramWidget/components/Content';
import type {Props} from './types';
import React, {Fragment, PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class LoadingContent extends PureComponent<Props> {
	renderContent = () => {
		const {buildData, children, widget} = this.props;
		const {data, error, loading} = buildData;

		if (!(loading || error) && data) {
			return <Content widget={widget}>{children(data)}</Content>;
		}

		return null;
	};

	renderError = () => {
		const {error} = this.props.buildData;
		return error ? <div className={styles.error} title={error}>{error}</div> : null;
	};

	renderLoading = () => this.props.buildData.loading ? <p><T text="LoadingContent::Loading" /></p> : null;

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

export default LoadingContent;
