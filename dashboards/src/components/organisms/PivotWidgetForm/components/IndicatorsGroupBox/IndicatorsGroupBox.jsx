// @flow
import {DIAGRAM_FIELDS} from 'WidgetFormPanel/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'WidgetFormPanel/components/FormField';
import {getErrorPath} from 'WidgetFormPanel/helpers';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import IndicatorGroupModal from './components/IndicatorGroupModal';
import type {IndicatorGrouping} from 'store/widgets/data/types';
import {INDICATOR_GROUPING_TYPE} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {Fragment, PureComponent} from 'react';
import t from 'localization';

export class IndicatorsGroupBox extends PureComponent<Props, State> {
	constructor (props: Props) {
		super(props);
		this.state = {
			showModal: false,
			value: props.value
		};
	}

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
		const {value} = this.props;
		return this.setState({showModal: false, value});
	};

	handleCreateValue = () => {
		const {data, value} = this.props;

		if (value) {
			this.showEditModal();
		} else {
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

			this.setState({showModal: true, value: newValue});
		}
	};

	handleSave = () => {
		const {onChange} = this.props;
		const {value} = this.state;

		if (onChange) {
			onChange(value);
			return this.setState({showModal: false});
		}
	};

	showEditModal = () => {
		const {value: propsValue} = this.props;
		return this.setState({showModal: true, value: propsValue});
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
		const {value} = this.props;
		const paths = value?.map(
			(item, index) => getErrorPath(DIAGRAM_FIELDS.indicatorGrouping, index, DIAGRAM_FIELDS.label)
		) ?? [];

		return (
			<Fragment>
				<FormBox rightControl={this.renderControl()} title={t('PivotWidgetForm::GroupingIndicators')}>
					<FormField paths={paths} small />
				</FormBox>
				{this.renderIndicatorGroupModal()}
			</Fragment>
		);
	}
}

export default IndicatorsGroupBox;
