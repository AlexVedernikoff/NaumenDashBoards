//Автор: NordClan
//Дата создания: 24.12.2021
//Код: ganttDataSet
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Gantt".
 * Содержит методы для работы с данными работ диаграммы.
 */
//Версия SMP: 4.12

package ru.naumen.modules.gantt

import com.amazonaws.util.json.Jackson
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Field
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.shared.dto.ISDtObject
import ru.naumen.core.server.script.api.metainfo.*
import ru.naumen.core.server.script.spi.ScriptDtObject

import javax.mail.Store

@Field @Lazy @Delegate GanttWorkHandlerController ganttWorkHandler = new GanttWorkHandlerImpl()

interface GanttWorkHandlerController
{
    /**
     * Метод редактирования диапазонов дат работ
     * @param requestContent - тело запроса
     * @param user - пользователь
     * @return результат обновления
     */
    String editWorkDateRanges(Map<String, Object> requestContent,
                              IUUIDIdentifiable user)

    /**
     * Метод получения групп атрибутов по метаклассу работы
     * @param metaClassFqn - код метакласса
     * @return список групп атрибутов
     */
    String getAttributeGroups(String metaClassFqn)

    /**
     * Метод получения списка атрибутов по метаклассу работы и коду группы атрибутов
     * @param metaClassFqn - код метакласса
     * @param attributeGroupCode - группа атрибутов
     * @param workUUID - UUID редактируемой работы
     * @return список атрибутов
     */
    String getWorkAttributes(String metaClassFqn, String attributeGroupCode, String workUUID)

    /**
     * Метод получения списка опций для атрибута
     * @param requestContent - тело запроса
     * @return список атрибутов
     */
    String getAttributeOptions(Map<String, String> requestContent)

    /**
     * Метод добавления новой работы
     * @param requestContent - тело запроса
     * @param user - пользователь
     * @return результат добавления
     */
    String addNewWork(Map<String, String> requestContent, IUUIDIdentifiable user)

    /**
     * Метод редактирования работы
     * @param requestContent - тело запроса
     * @param user - пользователь
     * @return результат добавления
     */
    String editWorkData(Map<String, String> requestContent, IUUIDIdentifiable user)

    /**
     * Метод удаления задач из диаграммы
     * @param workUUID - UUID редактируемой работы
     */
    String deleteWorkDateRanges(String workUUID)

    /**
     * Метод редактирования прогресса работы
     * @param requestContent - тело запроса
     * @return результат обновления
     */
    String changeWorkProgress(Map<String, String> requestContent)

    /**
     * Метод редактирования диапазона дат работ диаграмм версий
     * @param requestContent - тело запроса
     * @param user - пользователь
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     * @return результат обновления
     */
    String editWorkDateRangesFromVersion(Map<String, Object> requestContent,
                                         IUUIDIdentifiable user, String versionKey)

    /**
     * Метод добавления новой работы в диаграмму версий
     * @param requestContent - тело запроса
     * @param user - пользователь
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     * @return результат добавления
     */
    String addNewWorkForVersion(Map<String, String> requestContent,
                                IUUIDIdentifiable user,
                                String versionKey)

    /**
     * Метод редактирования работы в диаграмме версий
     * @param requestContent - тело запроса
     * @param user - пользователь
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     * @return результат добавления
     */
    String editWorkDataFromVersion(Map<String, String> requestContent,
                                   IUUIDIdentifiable user,
                                   String versionKey)

    /**
     * Метод редактирования прогресса работы в диаграмме версий
     * @param requestContent - тело запроса
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     * @return результат обновления
     */
    String changeWorkProgressFromVersion(Map<String, String> requestContent, String versionKey)

    /**
     * Метод удаления задач из диаграммы версий
     * @param workUUID - UUID редактируемой работы
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     */
    String deleteWorkFromVersion(String workUUID, String versionKey)

    /**
     * Метод сохранения связей между работами
     * @param requestContent - тело запроса
     * @return результат сохранения
     */
    String storeWorkRelations(Map<String, String> requestContent)

    /**
     * Метод получения ссылки на карточку работы
     * @param workUUID - UUID работы
     * @return ссылка на карточку работы
     */
    String getWorkPageLink(String workUUID)
}

@InheritConstructors
class GanttWorkHandlerImpl implements GanttWorkHandlerController
{
    GanttWorkHandlerService service = GanttWorkHandlerService.instance

    @Override
    String editWorkDateRanges(Map<String, Object> requestContent,
                              IUUIDIdentifiable user)
    {
        EditWorkDateRangesRequest request = new ObjectMapper().
            convertValue(requestContent, EditWorkDateRangesRequest)
        return Jackson.toJsonString(service.editWorkDateRanges(request, user))
    }

    @Override
    String getAttributeGroups(String metaClassFqn)
    {
        return Jackson.toJsonString(service.getAttributeGroups(metaClassFqn))
    }

    @Override
    String getWorkAttributes(String metaClassFqn, String attributeGroupCode, String workUUID = null)
    {
        return
        Jackson.toJsonString(service.getWorkAttributes(metaClassFqn, attributeGroupCode, workUUID))
    }

    @Override
    String getAttributeOptions(Map<String, String> requestContent)
    {
        GetAttributeOptionsRequest request = new ObjectMapper().
            convertValue(requestContent, GetAttributeOptionsRequest)
        return Jackson.toJsonString(service.getAttributeOptions(request))
    }

    @Override
    String addNewWork(Map<String, String> requestContent, IUUIDIdentifiable user)
    {
        AddNewWorkRequest request = new ObjectMapper().
            convertValue(requestContent, AddNewWorkRequest)
        return Jackson.toJsonString(service.addNewWork(request, user))
    }

    @Override
    String editWorkData(Map<String, String> requestContent, IUUIDIdentifiable user)
    {
        EditWorkDataRequest request = new ObjectMapper().
            convertValue(requestContent, EditWorkDataRequest)
        return Jackson.toJsonString(service.editWorkData(request, user))
    }

    @Override
    String deleteWorkDateRanges(String workUUID)
    {
        service.deleteWorkDateRanges(workUUID)
    }

    @Override
    String changeWorkProgress(Map<String, String> requestContent)
    {
        ChangeWorkProgressRequest request = new ObjectMapper().
            convertValue(requestContent, ChangeWorkProgressRequest)
        return Jackson.toJsonString(service.changeWorkProgress(request))
    }

    @Override
    String editWorkDateRangesFromVersion(Map<String, Object> requestContent,
                                         IUUIDIdentifiable user, String versionKey)
    {
        EditWorkDateRangesRequest request = new ObjectMapper().
            convertValue(requestContent, EditWorkDateRangesRequest)
        return
        Jackson.toJsonString(service.editWorkDateRangesFromVersion(request, user, versionKey))
    }

    @Override
    String addNewWorkForVersion(Map<String, String> requestContent,
                                IUUIDIdentifiable user, String versionKey)
    {
        AddNewWorkRequest request = new ObjectMapper().
            convertValue(requestContent, AddNewWorkRequest)
        return Jackson.toJsonString(service.addNewWorkForVersion(request, user, versionKey))
    }

    @Override
    String editWorkDataFromVersion(Map<String, String> requestContent,
                                   IUUIDIdentifiable user,
                                   String versionKey)
    {
        EditWorkDataRequest request = new ObjectMapper().
            convertValue(requestContent, EditWorkDataRequest)
        return Jackson.toJsonString(service.editWorkDataFromVersion(request, user, versionKey))
    }

    @Override
    String deleteWorkFromVersion(String workUUID, String versionKey)
    {
        return service.deleteWorkFromVersion(workUUID, versionKey)
    }

    @Override
    String changeWorkProgressFromVersion(Map<String, String> requestContent, String versionKey)
    {
        ChangeWorkProgressRequest request = new ObjectMapper().
            convertValue(requestContent, ChangeWorkProgressRequest)
        return Jackson.toJsonString(service.changeWorkProgressFromVersion(request, versionKey))
    }

    @Override
    String storeWorkRelations(Map<String, String> requestContent)
    {
        StoreWorkRelationsRequest request = new ObjectMapper().
            convertValue(requestContent, StoreWorkRelationsRequest)
        return Jackson.toJsonString(service.storeWorkRelations(request))
    }

    @Override
    String getWorkPageLink(String workUUID)
    {
        return service.getWorkPageLink(workUUID)
    }
}

@InjectApi
@Singleton
class GanttWorkHandlerService
{
    /**
     * Паттерн для даты работы
     */
    private static final String WORK_DATE_PATTERN = "yyyy-MM-dd'T'HH:mm:ss"

    /**
     * Предупреждение о превышенеии дедлайна
     */
    private static final String DEADLINE_WARNING_MESSAGE = 'Срок за пределами дедлайна "${workTitle}"'

    /**
     * MetaClass проекта
     */
    private static final String PROJECT_META_CLASS = 'PMProject$project'

    /**
     * Дедлайн атрибуты для метаклассов
     */
    private static final Map<String, String> metaClassDeadlineAttributesMap = [
        'PMProject'  : 'planEndDate',
        'serviceCall': 'deadLineTime'
    ]

    /**
     * Атрибуты дат начала для метаклассов
     */
    private static final Map<String, String> metaClassStartDateAttributesMap = [
        'PMProject'  : 'planStartDate',
        'serviceCall': 'startTime'
    ]

    /**
     * Метод редактирования диапазонов дат работ
     * @param request - тело запроса
     * @param user - пользователь
     * @return результат обновления
     */
    EditWorkDateRangesResponse editWorkDateRanges(EditWorkDateRangesRequest request,
                                                  IUUIDIdentifiable user)
    {
        try
        {
            List<String> warnings = []

        GanttSettingsService ganttSettingsService = GanttSettingsService.instance

        String diagramKey =
            ganttSettingsService.generateDiagramKey(request.subjectUUID, request.contentCode)
        String ganttSettingsFromKeyValue = ganttSettingsService.getJsonSettings(diagramKey)

        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()

        api.tx.call {
            request.workDateInterval.each { workDateData ->
                ISDtObject work = api.utils.get(workDateData.workUUID)
                String timezoneString =
                    api.employee.getTimeZone(user?.UUID)?.code ?: request.timezone
                TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                Date newDateToUpdate =
                    Date.parse(WORK_DATE_PATTERN, workDateData.value, timezone)

                List<ISDtObject> relatedEntities =
                    getWorkRelatedEntitiesWithExceededDeadline(work, work, newDateToUpdate)

                String attributeCode = null
                String metaClassId = work.getMetaClass().getId()
                ganttSettings.resourceAndWorkSettings.find {
                    if (it.source.value.value == metaClassId)
                    {
                        attributeCode =
                            workDateData.dateType == WorkEditDateType.startDate ?
                                it.startWorkAttribute.code : it.endWorkAttribute.code
                    }
                }

                api.utils.edit(work, [(attributeCode): newDateToUpdate])
                updateRelatedEntitiesDeadlines(relatedEntities, newDateToUpdate)
            }
        }

            return new EditWorkDateRangesResponse(updated: true)
        }
        catch (Exception e)
        {
            return EditWorkDateRangesResponse(errorMessage: e.message)
        }
    }

    /**
     * Метод удаления задач из диаграммы
     * @param workUUID - UUID редактируемой работы
     */
    String deleteWorkDateRanges(String workUUID)
    {
        try
        {
            utils.delete(utils.get(workUUID))
            return ("Deleting successful!")
        }
        catch (Exception e)
        {
            return ("errorMessage: " + e.message)
        }
    }

    /**
     * Метод получения групп атрибутов по метаклассу работы
     * @param metaClassFqn - код метакласса
     * @return список групп атрибутов
     */
    List<Map> getAttributeGroups(String metaClassFqn)
    {
        Collection attributeGroups = api.metainfo.getMetaClass(metaClassFqn).attributeGroups
        Collection attributeGroupsResponseData = attributeGroups.collect {
            return [code: it.code, title: it.title]
        }
        return attributeGroupsResponseData
    }

    /**
     * Метод получения списка атрибутов по метаклассу работы и коду группы атрибутов
     * @param metaClassFqn - код метакласса
     * @param attributeGroupCode - группа атрибутов
     * @param workUUID - UUID редактируемой работы
     * @return список атрибутов
     */
    List<Attribute> getWorkAttributes(String metaClassFqn,
                                      String attributeGroupCode,
                                      String workUUID = null)
    {
        IAttributeGroupWrapper attributeGroup =
            api.metainfo.getMetaClass(metaClassFqn).getAttributeGroup(attributeGroupCode)
        ISDtObject work = workUUID ? utils.get(workUUID) : null

        List attributes = attributeGroup.attributes.collect {
            Attribute attribute = new Attribute(code: it.code, type: it.type.code, title: it.title)
            if (work)
            {
                def attributeValue = work.get(it.code)
                if (attributeValue in IUUIDIdentifiable)
                {
                    attributeValue = attributeValue.UUID
                }
                attribute.value = attributeValue
            }
            return attribute
        }
        attributes = attributes.findAll {
            it.type in GanttSettingsService.ATTRIBUTE_TYPES_ALLOWED_FOR_EDITION
        }

        return attributes
    }

    /**
     * Метод получения списка опций для атрибута
     * @param request - тело запроса
     * @return список атрибутов
     */
    List<Map> getAttributeOptions(GetAttributeOptionsRequest request)
    {
        List<Map> attributeOptions
        String workMetaClassFqn = request.workMetaClassFqn

        switch (request.attribute.type)
        {
            case AttributeType.STATE_TYPE:
                attributeOptions = getStates(workMetaClassFqn)
                break
            default:
                IMetaClassWrapper workMetaClass = api.metainfo.getMetaClass(workMetaClassFqn)
                IAttributeWrapper attribute = workMetaClass.getAttribute(request.attribute.code)
                Collection<ISDtObject> objectsForOptions =
                    utils.find(attribute.type.relatedMetaClass, [:])
                attributeOptions = objectsForOptions.collect {
                    [title: it.title, uuid: it.UUID]
                }
        }

        return attributeOptions
    }

    /**
     * Метод добавления новой работы
     * @param request - тело запроса
     * @param user - пользователь
     */
    void addNewWork(AddNewWorkRequest request, IUUIDIdentifiable user)
    {
        Map<String, Object> preparedWorkData = prepareWorkData(request, user)
        utils.create(request.classFqn, preparedWorkData)
    }

    /**
     * Метод редактирования работы
     * @param request - тело запроса
     * @param user - пользователь
     */
    void editWorkData(EditWorkDataRequest request, IUUIDIdentifiable user)
    {
        Map<String, Object> preparedWorkData = prepareWorkData(request, user)
        ScriptDtObject res = utils.get(request.workUUID)
        utils.edit(res, preparedWorkData)
    }

    /**
     * Метод редактирования прогресса работы
     * @param request - тело запроса
     */
    void changeWorkProgress(ChangeWorkProgressRequest request)
    {
        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode
        Double progress = request.progress
        String workUUID = request.workUUID

        GanttSettingsService ganttSettingsService = GanttSettingsService.instance

        String diagramKey = ganttSettingsService.generateDiagramKey(subjectUUID, contentCode)
        String ganttSettingsFromKeyValue = ganttSettingsService.getJsonSettings(diagramKey)

        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()

        ganttSettings.workProgresses[workUUID] = progress

        if (!ganttSettingsService.saveJsonSettings(diagramKey, Jackson.toJsonString(ganttSettings)))
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод редактирования диапазона дат работ диаграмм версий
     * @param requestContent - тело запроса
     * @param user - пользователь
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     * @return результат обновления
     */
    EditWorkDateRangesResponse editWorkDateRangesFromVersion(EditWorkDateRangesRequest request,
                                                             IUUIDIdentifiable user,
                                                             String versionKey)
    {
        try
        {
            List<String> warnings = []

            GanttSettingsService ganttSettingsService = GanttSettingsService.instance

            String diagramKey =
                ganttSettingsService.generateDiagramKey(request.subjectUUID, request.contentCode)
            String ganttSettingsFromKeyValue = ganttSettingsService.getJsonSettings(diagramKey)

            GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
                ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
                : new GanttSettingsClass()

            api.tx.call {
                request.workDateInterval.each { workDateData ->
                    ISDtObject work = api.utils.get(workDateData.workUUID)
                    String timezoneString =
                        api.employee.getPersonalSettings(user?.UUID).getTimeZone() ?:
                            request.timezone
                    TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                    Date newDateToUpdate =
                        Date.parse(WORK_DATE_PATTERN, workDateData.value, timezone)

                    List<ISDtObject> relatedEntities =
                        getWorkRelatedEntitiesWithExceededDeadline(work, work, newDateToUpdate)

                    String attributeCode = null
                    String metaClassId = work.getMetaClass().getId()
                    ganttSettings.resourceAndWorkSettings.find {
                        if (it.source.value.value == metaClassId)
                        {
                            attributeCode =
                                workDateData.dateType == WorkEditDateType.startDate ?
                                    it.startWorkAttribute.code : it.endWorkAttribute.code
                        }
                    }

                    api.utils.edit(work, [(attributeCode): newDateToUpdate])
                    updateRelatedEntitiesDeadlines(relatedEntities, newDateToUpdate)
                }
            }

            return new EditWorkDateRangesResponse(updated: true)
        }
        catch (Exception e)
        {
            return EditWorkDateRangesResponse(errorMessage: e.message)
        }
    }

    /**
     * Метод добавления новой работы в диаграмму версий
     * @param request - тело запроса
     * @param user - пользователь
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     */
    void addNewWorkForVersion(AddNewWorkRequest request,
                              IUUIDIdentifiable user, String versionKey)
    {
<<<<<<< HEAD
        Map<String, Object> preparedWorkData =
            prepareWorkDataFromVersion(request, user, versionKey)
        utils.create(request.classFqn, preparedWorkData)
=======
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass settingsVersion =
            service.getGanttVersionsSettingsFromDiagramVersionKey(versionKey)

        Work work = new Work()
        work.attributesData.put('request', request)
        work.attributesData.put('user', user)

        settingsVersion.works.add(work)
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
    }

    /**
     * Метод редактирования работы в диаграмме версий
     * @param request - тело запроса
     * @param user - пользователь
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
=======
     * @param versionKey - ключ версии диаграммы
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
     */
    void editWorkDataFromVersion(EditWorkDataRequest request,
                                 IUUIDIdentifiable user, String versionKey)
    {
<<<<<<< HEAD
        Map<String, Object> preparedWorkData =
            prepareWorkDataFromVersion(request, user, versionKey)
        utils.edit(request.workUUID, preparedWorkData)
=======
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass settingsVersion =
            service.getGanttVersionsSettingsFromDiagramVersionKey(versionKey)

        Map<String, Object> preparedWorkData = prepareWorkData(request, user)
        settingsVersion.works.find {
            utils.edit(request.workUUID, preparedWorkData)
        }
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
    }

    /**
     * Метод редактирования прогресса работы в диаграмме версий
     * @param request - тело запроса
     * @param versionKey - ключ диаграммы версий
     */
    void changeWorkProgressFromVersion(ChangeWorkProgressRequest request, String versionKey)
    {
        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode
        Double progress = request.progress
        String workUUID = request.workUUID

        GanttSettingsService ganttSettingsService = GanttSettingsService.instance

        String diagramKey = ganttSettingsService.generateDiagramKey(subjectUUID, contentCode)
        String ganttVersionSettingsFromKeyValue = ganttSettingsService.getJsonSettings(diagramKey)

        GanttVersionsSettingsClass ganttVersionSettings = ganttVersionSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttVersionSettingsFromKeyValue, GanttSettingsClass)
            : new GanttVersionsSettingsClass()

        ganttVersionSettings.ganttSettings.workProgresses[workUUID] = progress

        if (!ganttSettingsService
            .saveJsonSettings(diagramKey, Jackson.toJsonString(ganttVersionSettings)))
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод удаления задач из диаграммы версий
     * @param workUUID - UUID редактируемой работы
<<<<<<< HEAD
     * @param versionKey - ключ диаграммы версий
     */
    String deleteWorkFromVersion(String workUUID, String versionKey)
    {
        try
        {
            utils.delete(utils.get(workUUID))
            return ("Deleting successful!")
        }
        catch (Exception e)
        {
            return ("errorMessage: " + e.message)
=======
     * @param versionKey - ключ версии диаграммы
     */
    String deleteWorkFromVersion(String workUUID, String versionKey)
    {
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass settingsVersion =
            service.getGanttVersionsSettingsFromDiagramVersionKey(versionKey)
        settingsVersion.works.find {
            try
            {
                utils.delete(workUUID)
                return ("Deleting successful!")
            }
            catch (Exception e)
            {
                return ("errorMessage: " + e.message)
            }
>>>>>>> 7511963558d2926d8273e38a42a28301906e94b5
        }
    }

    /**
     * Метод сохранения связей между работами - все связи для конкреной работы А пересохраняются
     * @param request - тело запроса
     */
    void storeWorkRelations(StoreWorkRelationsRequest request)
    {
        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode

        GanttSettingsService ganttSettingsService = GanttSettingsService.instance

        String diagramKey = ganttSettingsService.generateDiagramKey(subjectUUID, contentCode)
        String ganttSettingsFromKeyValue = ganttSettingsService.getJsonSettings(diagramKey)

        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()

        ganttSettings.workRelations = request.workRelations

        if (!ganttSettingsService.saveJsonSettings(diagramKey, Jackson.toJsonString(ganttSettings)))
        {
            throw new Exception('Связи не были сохранены!')
        }
    }

    /**
     * Метод получения ссылки на карточку работы
     * @param workUUID - UUID работы
     * @return ссылка на карточку работы
     */
    String getWorkPageLink(String workUUID)
    {
        return api.web.open(workUUID)
    }

    /**
     * Подготовка данных работы для обновления
     * @param request - тело запроса
     * @param user - пользователь
     * @return подготовленные данные работы для добавления/редактирования
     */
    private Map<String, Object> prepareWorkData(AddNewWorkRequest request, IUUIDIdentifiable user)
    {
        Map<String, Object> preparedWorkData = request.workData
        Collection<IAttributeWrapper> attributes =
            api.metainfo.getMetaClass(request.classFqn).getAttributes()
        preparedWorkData.each {
            String attributeCode = it.key
            Object attributeValue = it.value

            IAttributeWrapper attribute = attributes.find {
                it.code == attributeCode
            }
            if (attribute.type.code in AttributeType.DATE_TYPES)
            {
                String timezoneString =
                    api.employee.getTimeZone(user?.UUID)?.code ?: request.timezone
                TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                attributeValue = Date.parse(WORK_DATE_PATTERN, attributeValue, timezone)
                preparedWorkData[attributeCode] = attributeValue
            }
        }
        return preparedWorkData
    }

    /**
     * Подготовка данных работ в диаграмме версий для обновления
     * @param request - тело запроса
     * @param user - пользователь
     * @param versionKey - ключ диаграммы версий
     * @return подготовленные данные работы для добавления/редактирования
     */
    private Map<String, Object> prepareWorkDataFromVersion(AddNewWorkRequest request,
                                                           IUUIDIdentifiable user,
                                                           String versionKey)
    {
        Map<String, Object> preparedWorkData = request.workData
        Collection<IAttributeWrapper> attributes =
            api.metainfo.getMetaClass(request.classFqn).getAttributes()
        preparedWorkData.each {
            String attributeCode = it.key
            Object attributeValue = it.value

            IAttributeWrapper attribute = attributes.find {
                it.code == attributeCode
            }
            if (attribute.type.code in AttributeType.DATE_TYPES)
            {
                String timezoneString =
                    api.employee.getPersonalSettings(user?.UUID).getTimeZone() ?: request.timezone
                TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                attributeValue = Date.parse(WORK_DATE_PATTERN, attributeValue, timezone)
                preparedWorkData[attributeCode] = attributeValue
            }
        }
        return preparedWorkData
    }

    /**
     * Метод получения статусов объекта
     * @param classFqn - тип объекта
     * @return список статусов
     */
    private List<Map> getStates(String classFqn)
    {
        classFqn -= '__Evt'
        Collection types = [api.metainfo.getMetaClass(classFqn)] + api.metainfo.getTypes(classFqn)
        List states = []
        types.each { type ->
            type?.workflow
                ?.states
                ?.sort {
                    it.title
                }
                ?.each {
                    String title = it.title
                    String code = it.code
                    Boolean sameTitle = states.any {
                        it?.baseTitle == title
                    }
                    Boolean sameCode = states.any {
                        it?.uuid == code
                    }
                    Boolean toAdd = !(sameTitle && sameCode)
                    if (toAdd)
                    {
                        if (sameTitle || sameCode)
                        {
                            title = "${ it.title } (${ type.title })"
                        }

                        states << [title: title, uuid: code, baseTitle: it.title]
                    }
                } ?: []
        }
        states.sort {
            it.title
        }*.remove('baseTitle')
        return states
    }

    /**
     * Метод обновления дат дедлайнов у связанных с работой сущностей
     * @param relatedEntities
     * @param newDateToUpdate
     */
    private void updateRelatedEntitiesDeadlines(List<ISDtObject> relatedEntities,
                                                Date newDateToUpdate)
    {
        relatedEntities.each { entity ->
            String entityClassFqn = entity.getMetainfo().fqnOfClass().toString()
            String entityDeadlineAttribute = metaClassDeadlineAttributesMap[entityClassFqn]
            utils.edit(entity, [(entityDeadlineAttribute): newDateToUpdate])
        }
    }

    /**
     * Метод получения связанных с работой сущностей, которые ограничивают изменение ее дедлайна
     * @param work - работа
     * @param entity - сущность для рекурсивной проверки
     * @param newDateToUpdate - дата для обновления
     * @param relatedEntities - сущности
     * @return - связанные сущности
     */
    private List<ISDtObject> getWorkRelatedEntitiesWithExceededDeadline(
        ISDtObject work,
        ISDtObject entity,
        Date newDateToUpdate,
        List<ISDtObject> relatedEntities = [])
    {
        if (!api.metainfo.checkAttributeExisting(entity, 'project') &&
            entity.getMetainfo().fqnOfClass().toString() != 'PMProject')
        {
            if (exceedsEntityWorkDeadline(entity.project, newDateToUpdate, work))
            {
                relatedEntities << entity.project
            }

            if (!api.metainfo.checkAttributeExisting(entity.project, 'stages'))
            {
                entity.project.stages.each {
                    relatedEntities = getWorkRelatedEntitiesWithExceededDeadline(
                        work,
                        it,
                        newDateToUpdate,
                        relatedEntities
                    )
                }
            }
        }
        else if (entity.getMetainfo().fqnOfClass().toString() != 'PMProject')
        {
            if (exceedsEntityWorkDeadline(entity, newDateToUpdate, work))
            {
                relatedEntities << entity
            }

            return relatedEntities
        }
        else
        {
            if (exceedsEntityWorkDeadline(entity, newDateToUpdate, work))
            {
                relatedEntities << entity
            }

            List availableStages = []
            if (!api.metainfo.checkAttributeExisting(entity, 'stages'))
            {
                availableStages << 'stages'
            }
            if (!api.metainfo.checkAttributeExisting(entity, 'PMAllScs'))
            {
                availableStages << 'PMAllScs'
            }
            if (!api.metainfo.checkAttributeExisting(entity, 'PMActivity'))
            {
                availableStages << 'PMActivity'
            }

            availableStages.each {
                entity."${ it }".each {
                    relatedEntities = getWorkRelatedEntitiesWithExceededDeadline(
                        work,
                        it,
                        newDateToUpdate,
                        relatedEntities
                    )
                }
            }
        }

        return relatedEntities
    }

    /**
     * Метод определения, превышает ли дедлайн связанного с работой объекта дату работы для обновления
     * @param entity - объект, связанный с работой
     * @param newDateToUpdate - дата работы для обновления
     * @param work - работа
     * @return флаг превышения дедлайна
     */
    private Boolean exceedsEntityWorkDeadline(ISDtObject entity,
                                              Date newDateToUpdate,
                                              ISDtObject work)
    {
        String entityClassFqn = entity.getMetainfo().fqnOfClass().toString()
        String entityDeadlineAttribute = metaClassDeadlineAttributesMap[entityClassFqn]
        String entityStartDateAttribute = metaClassStartDateAttributesMap[entityClassFqn]

        String workClassFqn = work.getMetainfo().fqnOfClass().toString()
        String workDeadlineAttribute = metaClassDeadlineAttributesMap[workClassFqn]
        String workStartDateAttribute = metaClassStartDateAttributesMap[workClassFqn]

        def entityDeadline = entity[entityDeadlineAttribute]
        def workDeadline = work[workDeadlineAttribute]

        if (entity.metaClass.toString() != PROJECT_META_CLASS)
        {
            def entityStartDate = entity[entityStartDateAttribute]
            def workStartDate = work[workStartDateAttribute]

            // Проверка того, что границы дат работы должны укладываться внутри границ проверяемой сущности
            if (!(workStartDate.compareTo(entityStartDate) != -1 &&
                  workDeadline.compareTo(entityDeadline) != 1))
            {
                return false
            }
        }

        return newDateToUpdate.compareTo(entityDeadline) == 1
    }
}

/**
 * Класс запроса для сохранения связей между работами
 */
class StoreWorkRelationsRequest extends BaseGanttSettingsRequest
{
    /**
     * Настройки связей между работами
     */
    Collection<WorkRelation> workRelations
}

/**
 * Класс запроса для изменения прогресса работы
 */
class ChangeWorkProgressRequest extends BaseGanttSettingsRequest
{
    /**
     * UUID работы
     */
    String workUUID

    /**
     * Прогресс работы
     */
    Double progress
}

/**
 * Класс запроса для добавления работы
 */
class AddNewWorkRequest
{
    /**
     * Данные работы
     */
    Map<String, String> workData

    /**
     * Метакласс работы
     */
    String classFqn

    /**
     * Таймзона устройства пользователя
     */
    String timezone
}

/**
 * Класс запроса для редактирования работы
 */
class EditWorkDataRequest extends AddNewWorkRequest
{
    /**
     * UUID редактируемой работы
     */
    String workUUID
}

/**
 * Класс запроса для получения списка опций для атрибута
 */
class GetAttributeOptionsRequest
{
    /**
     * Метакласс добавляемой/редактируемой работы
     */
    String workMetaClassFqn

    /**
     * Атрибут для получения опций
     */
    Attribute attribute
}

/**
 * Класс запроса на редактирования диапазонов дат работ
 */
class EditWorkDateRangesRequest extends BaseGanttSettingsRequest
{
    /**
     * Таймзона устройства пользователя
     */
    String timezone

    /**
     * Даты работ для редактирования
     */
    Collection<WorkDateData> workDateInterval
}

/**
 * Данные для обновления работы из запроса
 */
class WorkDateData
{
    /**
     * UUID работы
     */
    String workUUID

    /**
     * Тип даты для редактирования
     */
    WorkEditDateType dateType

    /**
     * Значение даты для редактирования
     */
    String value
}

/**
 * Тело ответа на редактирования диапазонов дат работ
 */
class EditWorkDateRangesResponse
{
    /**
     * Флаг на обновление работ
     */
    Boolean updated = false

    /**
     * Сообщение об ошибке при обновлении работ
     */
    String errorMessage

    /**
     * Список предупреждений при обновлении работ
     */
    List<String> warnings = []
}
