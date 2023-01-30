// @flow
import {CANCEL_WIDGET_CREATE_CONFIRM_OPTIONS} from './constants';
import Component from 'components/organisms/DashboardPanel';
import {connect} from 'react-redux';
import type {DivRef} from 'components/types';
import {functions, props} from './selectors';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import t from 'localization';
import {withCommonDialog} from 'containers/CommonDialogs/withCommonDialog';

class DashboardPanel extends PureComponent<Props> {
	handleGoBack = (isCancel: boolean, relativeElement?: DivRef) => {
		const {cancelNewWidgetCreate, confirm, hideCopyPanel} = this.props;

		if (isCancel) {
			if (confirm(
				t('DashboardPanel::ConfirmCancelWidgetCreateTitle'),
				t('DashboardPanel::ConfirmCancelWidgetCreateText'),
				{
					...CANCEL_WIDGET_CREATE_CONFIRM_OPTIONS,
					relativeElement,
					submitText: t('DashboardPanel::ConfirmCancelWidgetCreateYes')
				}
			)) {
				cancelNewWidgetCreate();
			}
		}

		hideCopyPanel();
	};

	render () {
		return (<Component {...this.props} goBack={this.handleGoBack} />);
	}
}

export default withCommonDialog(connect(props, functions)(DashboardPanel));
