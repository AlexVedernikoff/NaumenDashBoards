// @flow
import {Button} from 'naumen-common-components';
import CheckboxPrivilege from './CheckboxPrivilege';
import cn from 'classnames';
import {connect} from 'react-redux';
import {Datepicker} from 'components/molecules/Datepicker/Datepicker.jsx';
import {deepClone, normalizeDate} from 'helpers';
import {functions, props} from 'components/organisms/FormPanel/selectors';
import {gantt} from 'naumen-gantt';
import IconButton from 'components/atoms/IconButton';
import {ICON_NAMES} from 'components/atoms/Icon';
import Modal from 'components/atoms/Modal/Modal';
import {postDataUsers} from 'store/App/actions';
import React, {useEffect, useState} from 'react';
import {ScaleNames} from 'components/organisms/FormPanel/consts';
import styles from './styles.less';
import {TextInput} from 'components/atoms/TextInput/TextInput';
import {useDispatch, useSelector} from 'react-redux';

const АctionBar = props => {
	const [active, setActive] = useState(true);

	const sd = new Date(props.startDate).toLocaleString();
	const ed = new Date(props.endDate).toLocaleString();

	const [inputStartDate, setInputStartDate] = useState(sd);
	const [inputEndDate, setInputEndDate] = useState(ed);

	const [flag, setFlag] = useState(true);

	const store = useSelector(state => state);

	useEffect(() => {
		const {endDate, startDate} = props;
		const conditionEndDate = endDate && endDate === 'string';
		const conditionStartDate = endDate && endDate === 'string';

		if (conditionEndDate && conditionStartDate && flag) {
			const startDateForPanel = startDate;
			const endDateForPanel = endDate;
			const replaceStartDateForPanel = startDateForPanel.replace(/\-/g, " ");
			const replaceEndDateForPanel = endDateForPanel.replace(/\-/g, " ");
			const parceStartDateForPanel = Date.parse(replaceStartDateForPanel);
			const parceEndDateForPanel = Date.parse(replaceEndDateForPanel);
			const newStartDateForPanel = new Date(parceStartDateForPanel);
			const newEndDateForPanel = new Date(parceEndDateForPanel);

			gantt.config.start_date = newStartDateForPanel;
			gantt.config.end_date = newEndDateForPanel;
			gantt.render();
			setFlag(false);
		}
	}, [props.endDate, props.startDate]);

	const [nameValue, setNameValue] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false);
	const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false);
	const [showModalConfirmation, setShowModalConfirmation] = useState(false);
	const [showModalSave, setShowModalSave] = useState(false);
	const [showModalUsers, setShowModalUsers] = useState(false);
	const [valueError, setValueError] = useState('');
	const [showListVersions, setShowListVersions] = useState(false);

	const dispatch = useDispatch();

	const panelButtons = [
		{icon: ICON_NAMES.DOWNLOAD_FILE, key: 'DOWNLOAD_FILE', method: 'method'}
	];
	const {addNewTask, editMode, endDate, handleToggle, name, refresh, startDate, settings} = props;
	const newSettings = deepClone(settings);
	let indexScaleName;

	useEffect(() => {
		if (endDate && startDate) {
			setInputEndDate(normalizeDate(endDate.toLocaleString()).toLocaleString());
			setInputStartDate(normalizeDate(startDate.toLocaleString()).toLocaleString());
		}
	}, [endDate, startDate]);

	const onSelectStartDate = value => {
		setInputStartDate(new Date(value).toLocaleString());
		setShowDatePickerStartDate(!showDatePickerStartDate);
	};

	const onSelectEndDate = value => {
		setInputEndDate(new Date(value).toLocaleString());
		setShowDatePickerEndDate(!showDatePickerEndDate);
	};

	const defineCurrenScale = active => {
		ScaleNames.find((item, index) => {
			item.value === active ? indexScaleName = index : undefined;
		});
	};

	defineCurrenScale(settings.scale);

	const zoomIn = () => {
		if (indexScaleName !== 4) {
			const setIndex = indexScaleName + 1;

			ScaleNames.find((item, index) => {
				if (index === setIndex) {
					newSettings.scale = item.value;
					props.changeScale(newSettings);
				}
			});
		}
	};

	const zoomOut = () => {
		if (indexScaleName !== 0) {
			const setIndex = indexScaleName - 1;

			ScaleNames.find((item, index) => {
				if (index === setIndex) {
					newSettings.scale = item.value;
					props.changeScale(newSettings);
				}
			});
		}
	};

	const renderDatePickerStartDate = () => {
		if (showDatePickerStartDate) {
			return <Datepicker onSelect={(value) => onSelectStartDate(value)} value="" />;
		}
	};

	const renderDatePickerEndDate = () => {
		if (showDatePickerEndDate) {
			return <Datepicker onSelect={(value) => onSelectEndDate(value)} value="" />;
		}
	};

	const sibmitRange = () => {
		const newStartDate = normalizeDate(inputStartDate);
		const newEndDate = normalizeDate(inputEndDate);

		if (Date.parse(newEndDate) >= Date.parse(newStartDate)) {
			const date = {
				endDate: newEndDate,
				startDate: newStartDate
			};

			props.setRangeTime(date);
			setShowModal(!showModal);
			setValueError('');
		} else if (Date.parse(newEndDate) <= Date.parse(newStartDate)) {
			setValueError('Дата начала не может быть позднее даты завершения');
		} else if (!inputStartDate.length || !inputEndDate.length) {
			setValueError('Заполните все поля');
		} else {
			setValueError('Некорректная дата');
		}
	};

	const changeStartDate = target => {
		setInputStartDate(target.value);
	};

	const changeEndDate = target => {
		setInputEndDate(target.value);
	};

	const renderModal = () => {
		if (showModal) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModal(!showModal)}
					onSubmit={() => sibmitRange()}
					submitText="Сохранить"
				>
					<div className={styles.inputwrapper}>
						<TextInput label="Начало интервала" maxLength={30} onChange={changeStartDate} placeholder="дд.мм.гггг, чч:мм:сс" value={inputStartDate} />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerStartDate(!showDatePickerStartDate)} />
					</div>
					{renderDatePickerStartDate()}
					<div className={styles.inputwrapper}>
						<TextInput label="Конец интервала" maxLength={30} onChange={changeEndDate} placeholder="дд.мм.гггг, чч:мм:сс" value={inputEndDate} />
						<IconButton className={styles.calendar} icon={ICON_NAMES.CALENDAR} onClick={() => setShowDatePickerEndDate(!showDatePickerEndDate)} />
					</div>
					{renderDatePickerEndDate()}
					<div className={styles.error}>{valueError}</div>
				</Modal>
			);
		}

		return null;
	};

	const submitConfirmation = () => {
		const {diagramKey, saveDataCurrentVersion, versionKey} = props;
		const {tasks} = store.APP;
		const tasksClone = deepClone(tasks);

		const links = gantt.getLinks();

		saveDataCurrentVersion(diagramKey, tasksClone, links);
		setShowModalConfirmation(!showModalConfirmation);
	};

	const renderModalConfirmation = () => {
		if (showModalConfirmation) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModalConfirmation(!showModalConfirmation)}
					onSubmit={() => submitConfirmation()}
					submitText="Принять"
				>
					<div>Изменения будут применены к атрибутам</div>
				</Modal>
			);
		}

		return null;
	};

	const sibmitSave = () => {
		setShowModalSave(!showModalSave);
	};

	const renderModalSave = () => {
		if (showModalSave) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModalSave(!showModalSave)}
					onSubmit={() => sibmitSave()}
					submitText="Сохранить"
				>
					<div>Изменения к атрибутам не будут применены</div>
				</Modal>
			);
		}

		return null;
	};

	const renderHeader = () => {
		return (
			<div className={styles.usersHeader}>
				<div>Список пользователей</div>
				<div>Права на редактирование</div>
			</div>
		);
	};

	const renderUser = (user) => {
		const {users} = store.APP;

		return (
			<div className={styles.users} key={user.code}>
				<div>{user.name}</div>
				<CheckboxPrivilege code={user.code} name="Checkbox" users={users} value={user.ganttMaster} />
			</div>
		);
	};

	const renderUsers = () => store.APP.users.map(renderUser);

	const onSubModal = () => {
		setShowModalUsers(!showModalUsers);
		dispatch(postDataUsers(store.APP.users));
	};

	const renderModalUsers = () => {
		if (showModalUsers) {
			return (
				<Modal
					className={styles.modalUsers}
					notice={true}
					onClose={() => setShowModalUsers(!showModalUsers)}
					onSubmit={onSubModal}
					submitText="Сохранить"
				>
					{renderHeader()}
					{renderUsers()}
				</Modal>
			);
		}

		return null;
	};

	const openSaveModal = () => {
		setShowModalSave(!showModalSave);
	};

	const openUsersModal = () => {
		setShowModalUsers(!showModalUsers);
	};

	const openConfirmationModal = () => {
		setShowModalConfirmation(!showModalConfirmation);
	};

	const changeNameValue = target => {
		setNameValue(target.value);
	};

	const submitSaveVersion = () => {
		const title = deepClone(nameValue);
		const {settings, tasks, workRelations} = store.APP;

		props.savedGanttVersionSettings(isPersonal, settings, title, new Date().toLocaleString(), tasks, workRelations);
		dispatch(props.setCurrentVersion(''));

		setShowModalSave(!showModalSave);
	};

	const renderModalSecondLevel = () => {
		if (showModalSave) {
			return (
				<Modal
					className={styles.modal}
					notice={true}
					onClose={() => setShowModalSave(!showModalSave)}
					onSubmit={submitSaveVersion}
					submitText="Сохранить"
				>
					<div className={styles.inputInnerwrapper}>
						<TextInput label="Название" maxLength={30} onChange={changeNameValue} value={nameValue} />
					</div>
					<div className={styles.inputInnerwrapper}>
						<TextInput label="Дата и время создания" maxLength={30} placeholder="дд.мм.гггг, чч:мм:сс" value={new Date().toLocaleString()} />
					</div>
				</Modal>
			);
		}

		return null;
	};

	const openClockModal = () => {
		setShowModal(!showModal);
	};

	const onCloseDateModal = event => {
		const notInteractiveElements = [
			'src-components-atoms-Icon-styles__icon',
			'src-components-molecules-Datepicker-styles__daysContainer',
			'src-components-molecules-Datepicker-styles__container',
			'src-components-atoms-DatepickerControl-styles__iconContainer',
			'_3wX93PsyvAvzd8jTwAHjLy'
		];

		if (notInteractiveElements.includes(event.target.className && event.target.className.animVal) === false) {
			setShowDatePickerStartDate(false);
			setShowDatePickerEndDate(false);
		}
	};

	React.useEffect(() => {
		document.addEventListener('click', onCloseDateModal);
		return () => document.removeEventListener('click', onCloseDateModal);
	});

	const {isPersonal} = store.APP;

	const renderButtonSettings = () => (editMode || isPersonal) ? <IconButton className={styles.icon} icon={ICON_NAMES.SETTINGS} onClick={handleToggle} tip="Настройка" /> : null;

	const handleVersionButtonClick = () => {
		const {diagramKey} = props;

		setShowListVersions(true);
		setActive(false);

		props.getVersionSettingsAll(isPersonal, diagramKey);
	};

	const handleCurrentButtonClick = () => {
		setActive(true);
		props.getGanttData(isPersonal);
		dispatch(props.setCurrentVersion(''));
	};

	const handleModalClose = () => {
		setShowListVersions(!showListVersions);
	};

	const selectedVersion = version => {
		handleModalClose();
		gantt.clearAll();

		setTimeout(() => {
			props.getVersionSettings(version.diagramKey);

			gantt.parse(JSON.stringify({data: store.APP.tasks, links: store.APP.workRelations}));
			gantt.render();
		}, 0);
	};

	const deleteVersion = (title, diagramKey) => {
		const versions = deepClone(props.versions).filter(version => version.title !== title);

		props.deleteGanttVersionSettings(diagramKey);
		props.setListVersions(versions);
	};

	const renderVersion = (version) => {
		return (
			<div className={styles.itemBlock}>
				<div key={version.diagramKey} onClick={() => selectedVersion(version)}>
					{version.title}
				</div>
				<div onClick={() => deleteVersion(version.title, version.diagramKey)}>Удалить</div>
			</div>
		);
	};

	const renderVersions = () => props.versions.map(renderVersion);

	const renderModalListVersions = () => {
		const classes = styles.modal + ' ' + styles.modalVarsions;

		if (showListVersions) {
			return (
				<Modal
					className={classes}
					notice={true}
					onClose={handleModalClose}
					onSubmit={handleModalClose}
					submitText="Закрыть"
				>
					<ul className={styles.listTitle}>
						{renderVersions()}
					</ul>
				</Modal>
			);
		}

		return null;
	};

	const renderButtonsVersion = () => {
		const versionsCN = cn({
			[styles.btn]: true,
			[styles.btnVersions]: true,
			[styles.unActive]: active
		});

		const currentCN = cn({
			[styles.btn]: true,
			[styles.btnCurrent]: true,
			[styles.unActive]: !active
		});

		return (
			<div className={styles.leftContainer}>
				<Button className={versionsCN} onClick={handleVersionButtonClick}>Версии</Button>
				<Button className={currentCN} onClick={handleCurrentButtonClick}>Текущий</Button>
			</div>
		);
	};

	const renderButtonUsers = () => {
		const {role} = store.APP.user;

		return role === 'SUPER' && <Button className={styles.btn} onClick={openUsersModal}>Пользователи</Button>;
	};

	const renderButtonsZoom = () => {
		const className = cn({
			[styles.icon]: true,
			[styles.rightBorder]: true
		});

		return (
			<>
				<IconButton className={styles.icon} icon={ICON_NAMES.ZOOM_OUT} onClick={zoomIn} tip="Уменьшить масштаб" />
				<IconButton className={className} icon={ICON_NAMES.ZOOM_IN} onClick={zoomOut} tip="Увеличить масштаб" />
			</>
		);
	};

	const renderButtonInterval = () => <IconButton className={styles.icon} icon={ICON_NAMES.CLOCK} onClick={openClockModal} tip="Интервал" />;

	const renderButtonRefresh = () => <IconButton className={styles.icon} icon={ICON_NAMES.FAST_REFRESH} onClick={refresh} tip="Обновить" />;

	const renderButtonsEventVersion = () => (
		<>
			<Button className={styles.btn} onClick={openConfirmationModal}>Применить</Button>
			<Button className={styles.btn} onClick={openSaveModal}>Сохранить вид</Button>
		</>
	);

	const renderButtonExport = () => {
		return (
			panelButtons.map(item =>
				<IconButton
					className={styles.icon}
					icon={item.icon}
					key={item.key}
					onClick={props.onClick}
					tip="Экспорт"
				>{item.icon}</IconButton>
			)
		);
	};

	const renderPanel = () => {
		return (
			<div className={styles.container}>
				{renderButtonsVersion()}
				<div className={styles.container}>
					{renderButtonUsers()}
					{renderButtonsZoom()}
					{renderButtonSettings()}
					{renderButtonInterval()}
					{renderButtonExport()}
					{/* следующая итерация */}
					{/* <IconButton className={styles.icon} icon={ICON_NAMES.BIG_PLUS} onClick={addNewTask} tip="Добавить работу" /> */}
					{renderButtonRefresh()}
					{renderButtonsEventVersion()}
				</div>
			</div>
		);
	};

	return (
		<div className={styles.wrapper}>
			{renderPanel()}
			{renderModal()}
			{renderModalConfirmation()}
			{renderModalUsers()}
			{renderModalSecondLevel()}
			{renderModalListVersions()}
		</div>
	);
};

export default connect(props, functions)(АctionBar);
