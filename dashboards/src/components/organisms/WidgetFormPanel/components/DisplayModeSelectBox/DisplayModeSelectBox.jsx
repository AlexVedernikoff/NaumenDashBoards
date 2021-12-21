// @flow
import {DISPLAY_MODE_OPTIONS} from 'store/widgets/constants';
import FormBox from 'components/molecules/FormBox';
import FormField from 'components/molecules/FormField';
import type {OnSelectEvent} from 'components/types';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import Select from 'components/molecules/Select';
import t from 'localization';
import {USER_ROLES} from 'store/context/constants';

export class DisplayModeSelectBox extends PureComponent<Props, State> {
	state = {
		value: this.getValue(this.props)
	};

	getValue (props: Props) {
		return DISPLAY_MODE_OPTIONS.find(item => item.value === props.value) || DISPLAY_MODE_OPTIONS[0];
	}

	componentDidUpdate (prevProps: Props) {
		if (prevProps.value !== this.props.value) {
			this.setState({value: this.getValue(this.props)});
		}
	}

	handleChange = ({value}: OnSelectEvent) => {
		const {name, onChange} = this.props;
		const {value: modeValue} = value;

		onChange(name, modeValue);
	};

	render () {
		const {isUserMode, personalDashboard, user} = this.props;
		const {value} = this.state;

		if (user.role !== USER_ROLES.REGULAR && !personalDashboard && !isUserMode) {
			return (
				<FormBox title={t('DisplayModeSelectBox::DisplayMode')}>
					<FormField>
						<Select
							getOptionLabel={option => t(option.label)}
							onSelect={this.handleChange}
							options={DISPLAY_MODE_OPTIONS}
							placeholder={t('DisplayModeSelectBox::DisplayInMobile')}
							value={value}
						/>
					</FormField>
				</FormBox>
			);
		}

		return null;
	}
}

export default DisplayModeSelectBox;
