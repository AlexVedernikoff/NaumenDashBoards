// @flow
import FormBox from 'components/molecules/FormBox';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorGroupModal from './components/IndicatorGroupModal';
import type {IndicatorGrouping} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import t from 'localization';

export class IndicatorsGroupBox extends PureComponent<Props, State> {
	state = {
		showModal: false,
		value: null
	};

	handleChange = (value: IndicatorGrouping) => {
		this.setState({value});
	};

	handleClearValue = () => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(null);
		}
	};

	handleClose = () => {
		this.setState({showModal: false});
	};

	handleCreateValue = () => {
		const {data, value} = this.props;

		if (!value) {
			const newValue = data.flatMap(dataSet => dataSet.indicators.map(indicator => (
				indicator.attribute
					? {
						hasBreakdown: !!(indicator.breakdown?.attribute),
						key: indicator.key,
						label: indicator.attribute?.title ?? '',
						type: INDICATOR_GROUPING_TYPE.INDICATOR_INFO
					}
					: null
			)).filter(Boolean));

			this.setState({value: newValue}, this.showEditModal);
		} else {
			this.showEditModal();
		}
	};

	handleSave = (value: IndicatorGrouping | null) => {
		const {onChange} = this.props;

		if (onChange) {
			onChange(value);
			this.handleClose();
		}
	};

	showEditModal = () => {
		const {value: propsValue} = this.props;
		const {value: stateValue} = this.state;

		return this.setState({showModal: true, value: stateValue ?? propsValue});
	};

	renderControl = () => {
		const {value} = this.props;
		const {BASKET, EDIT, PLUS} = ICON_NAMES;

		if (value) {
			return (
				<Fragment>
					<IconButton icon={EDIT} onClick={this.showEditModal} round={false} />
					<IconButton icon={BASKET} onClick={this.handleClearValue} round={false} />
				</Fragment>
			);
		}

		return <IconButton icon={PLUS} onClick={this.handleCreateValue} round={false} />;
	};

	renderIndicatorGroupModal = () => {
		const {showModal, value} = this.state;

		if (showModal && value !== null) {
			return (
				<IndicatorGroupModal
					onChange={this.handleChange}
					onClose={this.handleClose}
					onSave={this.handleSave}
					value={value}
				/>
			);
		}

		return null;
	};

	render () {
		return (
			<Fragment>
				<FormBox rightControl={this.renderControl()} title={t('PivotWidgetForm::GroupingIndicators')} />
				{this.renderIndicatorGroupModal()}
			</Fragment>
		);
	}
}

export default IndicatorsGroupBox;
