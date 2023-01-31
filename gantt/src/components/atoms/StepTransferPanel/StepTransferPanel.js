// @flow
import cn from 'classnames';
import {
	Datepicker,
	IconButton,
	Select,
	TextInput
} from 'naumen-common-components';
import {gantt} from 'naumen-gantt';
import {ICON_NAMES} from 'components/atoms/Icon';
import {normalizeDate} from 'helpers';
import React, {useState} from 'react';
import {ScaleNames} from './consts';
import styles from './styles.less';
import {useSelector} from 'react-redux';

const StepTransferPanel = props => {
	const [scale, setScale] = useState({label: 'День', value: 'DAY'});
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const currentDate = new Date();
	const [inputStartDate, setInputStartDate] = useState(currentDate.toLocaleString());

	const store = useSelector(state => state);
	const dateToStr = gantt.date.date_to_str('%d.%m.%Y, %H:%i:%s');

	const handleScaleChange = ({value}) => {
		const newScale = ScaleNames.find(item => item.value === value.value);
		setScale(newScale);
	};

	const changeStartDate = target => {
		setInputStartDate(target.value);
	};

	const onSelectStartDate = value => {
		setInputStartDate(new Date(value).toLocaleString());
		gantt.showDate(new Date(value));
		setShowDatePickerStartDate(!showDatePickerStartDate);
	};

	const renderDatePickerStartDate = () => {
		if (showDatePickerStartDate) {
			return <div className={styles.datepicker}><Datepicker onSelect={value => onSelectStartDate(value)} value="" /></div>
		}
	};

	const makeStepToStartDate = () => {
		setInputStartDate(dateToStr(normalizeDate(store.APP.startDate.toLocaleString())));

		const dateObject = dateToStr(normalizeDate(store.APP.startDate.toLocaleString()));
		const date = gantt.date.parseDate(dateObject, '%d.%m.%Y, %H:%i:%s');

		gantt.showDate(date);
	};

	const makeStepToEndDate = () => {
		setInputStartDate(dateToStr(normalizeDate(store.APP.endDate.toLocaleString())));

		const dateObject = dateToStr(normalizeDate(store.APP.endDate.toLocaleString()));
		const date = gantt.date.parseDate(dateObject, '%d.%m.%Y, %H:%i:%s');

		gantt.showDate(date);
	};

	const makeNextStep = () => {
		const date = gantt.date.parseDate(inputStartDate, '%d.%m.%Y, %H:%i:%s');
		const endDate = gantt.date.add(date, 1, scale.value.toLowerCase());

		setInputStartDate(endDate.toLocaleString());
		gantt.showDate(endDate);
	};

	const makePrevStep = () => {
		const date = gantt.date.parseDate(inputStartDate, '%d.%m.%Y, %H:%i:%s');
		const endDate = gantt.date.add(date, -1, scale.value.toLowerCase());

		setInputStartDate(endDate.toLocaleString());
		gantt.showDate(endDate);
	};

	const renderStepPanel = () => {
		return (
			<div className={styles.left}>
				<div className={styles.leftIcon} onClick={makeStepToStartDate}>
					<span>|</span>
					<IconButton className={styles.icon} icon="LEFT_ANGLE" />
				</div>
				<div className={styles.block} onClick={makePrevStep}>
					<IconButton className={styles.icon} icon="LEFT_ANGLE" />
				</div>
				<div className={styles.inputwrapper}>
					<TextInput label="Начало интервала" maxLength={30} onChange={changeStartDate} placeholder="дд.мм.гггг, чч:мм:сс" value={inputStartDate} className={styles.input} />
					<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerStartDate(!showDatePickerStartDate)} />
				</div>
				{renderDatePickerStartDate()}
				<div className={styles.block} onClick={makeNextStep}>
					<IconButton className={styles.icon} icon="RIGHT_ANGLE" />
				</div>
				<div className={styles.right_icon} onClick={makeStepToEndDate}>
					<IconButton className={styles.icon} icon="RIGHT_ANGLE" />
					<span>|</span>
				</div>
			</div>
		);
	};

	const toggleOption = direction => () => {
		const count = direction === 'prev' ? -1 : 1;

		ScaleNames.filter((item, index) => {
			if (item.value === scale.value) {
				ScaleNames.filter((newItem, newIndex) => {
					if (newIndex === index + count) {
						setScale(newItem);
					}
				});
			}
		});
	};

	const renderDropDownInterval = () => {
		return (
			<div className={styles.wrapper}>
				<div className={styles.block}>
					<IconButton className={styles.icon} icon="PLUS" onClick={toggleOption('next')} />
				</div>
				<div className={styles.select}>
					<Select
						className={cn(styles.selectIcon, styles.top)}
						icon={"CHEVRON"}
						onSelect={handleScaleChange}
						options={ScaleNames}
						placeholder="Масштаб по умолчанию"
						value={scale} />
				</div>
				<div className={styles.block}>
					<IconButton className={styles.icon} icon="MINUS" onClick={toggleOption('prev')} />
				</div>
			</div>
		);
	};

	return (
		<div className={styles.container}>
			{renderStepPanel()}
			{renderDropDownInterval()}
		</div>
	);
};

export default StepTransferPanel;
