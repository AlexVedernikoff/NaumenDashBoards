//Автор: NordClan
//Дата создания: 24.12.2021
//Код: ganttWorkHandler
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
import static groovy.json.JsonOutput.toJson
import ru.naumen.core.server.script.spi.ScriptDtObject
import ru.naumen.core.server.script.api.metainfo.WorkflowWrapper

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
    String deleteWork(String workUUID)

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
     * @param versionKey - ключ диаграммы версий
     * @return результат обновления
     */
    String editWorkDateRangesForVersion(Map<String, Object> requestContent,
                                        IUUIDIdentifiable user, String versionKey)

    /**
     * Метод добавления новой работы в диаграмму версий
     * @param requestContent - тело запроса
     * @param versionKey - ключ диаграммы версий
     */
    String addNewWorkForVersion(Map<String, String> requestContent, String versionKey)

    /**
     * Метод редактирования работы в диаграмме версий
     * @param requestContent - тело запроса
     * @param versionKey - ключ диаграммы версий
     */
    String editWorkDataForVersion(Map<String, String> requestContent, String versionKey)

    /**
     * Метод редактирования прогресса работы в диаграмме версий
     * @param requestContent - тело запроса
     * @param versionKey - ключ диаграммы версий
     */
    String changeWorkProgressForVersion(Map<String, String> requestContent, String versionKey)

    /**
     * Метод удаления задач из диаграммы версий
     * @param workUUID - UUID редактируемой работы
     * @param versionKey - ключ диаграммы версий
     */
    String deleteWorkForVersion(String workUUID, String versionKey)

    /**
     * Метод сохранения связей между работами
     * @param requestContent - тело запроса
     * @return результат сохранения
     */
    String storeWorkRelations(Map<String, String> requestContent)

    /**
     * Метод получения ссылки на карточку работы
     * @param workUUID - UUID работы
     * @param diagramKey - ключ диаграммы
     * @return ссылка на карточку работы
     */
    String getWorkPageLink(String workUUID, String diagramKey)
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
    String deleteWork(String workUUID)
    {
        return Jackson.toJsonString(service.deleteWork(workUUID))
    }

    @Override
    String changeWorkProgress(Map<String, String> requestContent)
    {
        ChangeWorkProgressRequest request = new ObjectMapper().
            convertValue(requestContent, ChangeWorkProgressRequest)
        return Jackson.toJsonString(service.changeWorkProgress(request))
    }

    @Override
    String editWorkDateRangesForVersion(Map<String, Object> requestContent,
                                        IUUIDIdentifiable user, String versionKey)
    {
        EditWorkDateRangesRequest request = new ObjectMapper().
            convertValue(requestContent, EditWorkDateRangesRequest)
        return Jackson.toJsonString(service.editWorkDateRangesForVersion(request, user, versionKey))
    }

    @Override
    String addNewWorkForVersion(Map<String, String> requestContent, String versionKey)
    {
        AddNewWorkRequest request = new ObjectMapper().
            convertValue(requestContent, AddNewWorkRequest)
        return Jackson.toJsonString(service.addNewWorkForVersion(request, versionKey))
    }

    @Override
    String editWorkDataForVersion(Map<String, String> requestContent, String versionKey)
    {
        EditWorkDataRequest request = new ObjectMapper().
            convertValue(requestContent, EditWorkDataRequest)
        return Jackson.toJsonString(service.editWorkDataForVersion(request, versionKey))
    }

    @Override
    String deleteWorkForVersion(String workUUID, String versionKey)
    {
        return service.deleteWorkForVersion(workUUID, versionKey)
    }

    @Override
    String changeWorkProgressForVersion(Map<String, String> requestContent, String versionKey)
    {
        ChangeWorkProgressRequest request = new ObjectMapper().
            convertValue(requestContent, ChangeWorkProgressRequest)
        return Jackson.toJsonString(service.changeWorkProgressForVersion(request, versionKey))
    }

    @Override
    String storeWorkRelations(Map<String, String> requestContent)
    {
        StoreWorkRelationsRequest request = new ObjectMapper().
            convertValue(requestContent, StoreWorkRelationsRequest)
        return Jackson.toJsonString(service.storeWorkRelations(request))
    }

    @Override
    String getWorkPageLink(String workUUID, String diagramKey)
    {
        return toJson(service.getWorkPageLink(workUUID, diagramKey))
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
                    Date newDateToUpdate = (workDateData.value) ?
                        Date.parse(WORK_DATE_PATTERN, workDateData.value, timezone) : null

                    List<ISDtObject> relatedEntities =
                        getWorkRelatedEntitiesWithExceededDeadline(work, work, newDateToUpdate)

                    String attributeCode = null
                    Object metaClass = api.metainfo.getMetaClass(work.getMetaClass())
                    String metaClassCode = metaClass.code
                    String parentMetaClassCode = metaClass.parent?.code
                    ganttSettings.resourceAndWorkSettings.find {
                        if (it.source.value.value in [metaClassCode, parentMetaClassCode])
                        {
                            attributeCode =
                                workDateData.dateType == WorkEditDateType.startDate ?
                                    it.startWorkAttribute.code : it.endWorkAttribute.code
                            if (attributeCode.contains('@'))
                            {
                                attributeCode = attributeCode.split('@').last()
                            }
                        }
                        ISDtObject currentObject = api.utils.get(workDateData.workUUID)
                        String milestoneAttributeName =
                            it?.checkpointStatusAttr?.code?.split('@')?.last()
                        if (currentObject?.hasProperty(milestoneAttributeName) &&
                            currentObject[milestoneAttributeName])
                        {
                            attributeCode = milestoneAttributeName
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
            return new EditWorkDateRangesResponse(errorMessage: e.message)
        }
    }

    /**
     * Метод удаления работы
     * @param workUUID - UUID удаляемой работы
     */
    void deleteWork(String workUUID)
    {
        utils.delete(workUUID)
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
        if (request.workData.size() == 1)
        {
            if (!
                api.metainfo.getMetaClass(request.classFqn)
                   .getAttribute(request.workData*.key.first()).editable)
            {
                throw new Exception("error: attribute ${ request.workData*.key.first() } metaclass ${ request.classFqn } non-editable")
            }
        }
        Map<String, Object> preparedWorkData = prepareWorkDataToUpdate(request, user)
        Map editedWorks = [:]
        ISDtObject res = utils.get(request.workUUID)
        String errorMessage = ''
        preparedWorkData.each {
            if (api.metainfo.getMetaClass(request.classFqn).getAttribute(it.key).editable)
            {
                editedWorks << [(it.key): (it.value)]
            }
        }
        utils.edit(res, editedWorks)
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
     * @param request - тело запроса
     * @param user - пользователь
     * @param versionKey - ключ диаграммы версий
     * @return результат обновления
     */
    EditWorkDateRangesResponse editWorkDateRangesForVersion(EditWorkDateRangesRequest request,
                                                            IUUIDIdentifiable user,
                                                            String versionKey)
    {
        try
        {
            GanttSettingsService ganttSettingsService = GanttSettingsService.instance

            GanttVersionsSettingsClass ganttVersionSettings =
                ganttSettingsService.getGanttVersionsSettings(request.contentCode)
            request.workDateInterval.each { workDateData ->
                ISDtObject work = api.utils.get(workDateData.workUUID)
                String timezoneString =
                    api.employee.getPersonalSettings(user?.UUID).getTimeZone() ?:
                        request.timezone
                TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                Date newDateToUpdate = (workDateData.value) ?
                    Date.parse(WORK_DATE_PATTERN, workDateData.value, timezone) : null

                String attributeCode = null
                Object metaClass = api.metainfo.getMetaClass(work.getMetaClass())
                String metaClassCode = metaClass.code
                String parentMetaClassCode = metaClass.parent?.code
                ganttVersionSettings.ganttSettings.resourceAndWorkSettings.find {
                    if (it.source.value.value in [metaClassCode, parentMetaClassCode])
                    {
                        attributeCode =
                            workDateData.dateType == WorkEditDateType.startDate ?
                                it.startWorkAttribute.code : it.endWorkAttribute.code
                        if (attributeCode.contains('@'))
                        {
                            attributeCode = attributeCode.split('@').last()
                        }
                    }
                }

                DiagramEntity workToEdit = ganttVersionSettings.diagramEntities.find {
                    it.entityUUID == workDateData.workUUID
                }
                //workToEdit.attributesData[attributeCode] = newDateToUpdate.toTimestamp().getTime()
            }

            if (
                ganttSettingsService.saveJsonSettings(
                    versionKey,
                    Jackson.toJsonString(ganttVersionSettings),
                    GanttSettingsService.GANTT_VERSION_NAMESPACE
                )
            )
            {
                return new EditWorkDateRangesResponse(updated: true)
            }
            else
            {
                throw new Exception('Работа не была сохранена!')
            }
        }
        catch (Exception e)
        {
            return new EditWorkDateRangesResponse(errorMessage: e.message)
        }
    }

    /**
     * Метод добавления новой работы в версию диаграммы
     * @param request - тело запроса
     * @param versionKey - ключ версии диаграммы
     */
    void addNewWorkForVersion(AddNewWorkRequest request, String versionKey)
    {
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass ganttVersionSettings =
            service.getGanttVersionsSettings(versionKey)

        DiagramEntity work = new DiagramEntity()
        work.attributesData = request.workData
        work.classFqn = request.classFqn
        work.statusWork = StatusWork.ADDED

        ganttVersionSettings.diagramEntities << work

        if (!service.saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GanttSettingsService.GANTT_VERSION_NAMESPACE
        ))
        {
            throw new Exception('Работа не была добавлена!')
        }
    }

    /**
     * Метод редактирования работы в версии диаграммы
     * @param request - тело запроса
     * @param versionKey - ключ версии диаграммы
     */
    void editWorkDataForVersion(EditWorkDataRequest request, String versionKey)
    {
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass ganttVersionSettings =
            service.getGanttVersionsSettings(versionKey)

        DiagramEntity workToEdit = ganttVersionSettings.diagramEntities.find {
            it.entityUUID == request.workUUID
        }
        workToEdit.attributesData.putAll(request.workData)
        workToEdit.statusWork = StatusWork.EDITED

        if (!service.saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GanttSettingsService.GANTT_VERSION_NAMESPACE
        ))
        {
            throw new Exception('Работа не была отредактирована!')
        }
    }

    /**
     * Метод редактирования прогресса работы в версии диаграммы
     * @param request - тело запроса
     * @param versionKey - ключ диаграммы версий
     */
    void changeWorkProgressForVersion(ChangeWorkProgressRequest request, String versionKey)
    {
        Double progress = request.progress
        String workUUID = request.workUUID

        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass ganttVersionSettings =
            service.getGanttVersionsSettings(versionKey)
        ganttVersionSettings.ganttSettings.workProgresses[workUUID] = progress

        if (!service.saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GanttSettingsService.GANTT_VERSION_NAMESPACE
        ))
        {
            throw new Exception('Прогресс не был изменен!')
        }
    }

    /**
     * Метод удаления задач из диаграммы версий
     * @param workUUID - UUID редактируемой работы
     * @param versionKey - ключ версии диаграммы
     */
    void deleteWorkForVersion(String workUUID, String versionKey)
    {
        GanttSettingsService service = GanttSettingsService.instance
        GanttVersionsSettingsClass ganttVersionSettings =
            service.getGanttVersionsSettings(versionKey)

        DiagramEntity workToDelete = ganttVersionSettings.diagramEntities.find {
            it.entityUUID == workUUID
        }
        workToDelete.statusWork = StatusWork.DELETED

        if (!service.saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GanttSettingsService.GANTT_VERSION_NAMESPACE
        ))
        {
            throw new Exception('Работа не была удалена!')
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
     * Метод получения информации о редактируемости элемента схемы
     * @param workUUID - UUID работы
     * @param diagramKey - ключ диаграммы
     * @return ссылка на карточку работы
     */
    Map<String, Object> getWorkPageLink(String workUUID, String diagramKey)
    {
        GanttSettingsService ganttSettingsService = GanttSettingsService.instance
        String ganttVersionSettingsJsonValue = ganttSettingsService.getJsonSettings(diagramKey)

        GanttSettingsClass ganttVersionSettings = ganttVersionSettingsJsonValue
            ? Jackson.fromJsonString(ganttVersionSettingsJsonValue, GanttSettingsClass)
            : new GanttSettingsClass()
        ResourceAndWorkSettings resourceWork = ganttVersionSettings.resourceAndWorkSettings.find {
            it.type == SourceType.WORK
        }

        String metaClassFqn = resourceWork.startWorkAttribute.metaClassFqn
        String startWorkAttribute = resourceWork.startWorkAttribute.code.split('@').last()
        String endWorkAttribute = resourceWork.endWorkAttribute.code.split('@').last()

        Map<String, Object> dataModalWindowOperation = [:]
        dataModalWindowOperation << ['link': api.web.open(workUUID)]
        dataModalWindowOperation << ['title':
                                         api.metainfo.getMetaClass(metaClassFqn)
                                            .getAttribute('title').attribute.isEditable()]
        dataModalWindowOperation << ['startDate':
                                         api.metainfo.getMetaClass(metaClassFqn)
                                            .getAttribute(startWorkAttribute)
                                            .attribute.isEditable()]
        dataModalWindowOperation << ['endDate':
                                         api.metainfo.getMetaClass(metaClassFqn)
                                            .getAttribute(endWorkAttribute).attribute.isEditable()]
        dataModalWindowOperation << ['disabledCompete':
                                         api.metainfo.getMetaClass(metaClassFqn)
                                            .getAttribute('state').attribute.isEditable()]
        return dataModalWindowOperation
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
        Map<String, Object> newWorkData = [:]
        preparedWorkData.each {
            String attributeCode = it.key
            Object attributeValue = it.value

            if (attributeCode.contains('@'))
            {
                Collection<String> splitForDog = attributeCode.split('@')
                attributeCode = splitForDog[splitForDog.length - 1]
            }

            IAttributeWrapper attribute = attributes.find {
                it.code == attributeCode
            }
            if (attribute?.type?.code in AttributeType.DATE_TYPES)
            {
                String timezoneString =
                    api.employee.getTimeZone(user?.UUID)?.code ?: request.timezone
                TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                attributeValue = Date.parse(WORK_DATE_PATTERN, attributeValue, timezone)
                newWorkData << [(attributeCode): attributeValue]
            }
            else
            {
                newWorkData << it
            }
        }
        Map<String, Object> mandatoryAttributes = [:]
        request.attr.each { entry ->
            entry.each {
                mandatoryAttributes << [(it.key): (it.value)]
            }
        }
        mandatoryAttributes.each {
            newWorkData << [(it.key): (it.value)]
        }
        return newWorkData
    }

    /**
     * Подготовка данных при редактировании ячеек
     * @param request - тело запроса
     * @param user - пользователь
     * @return подготовленные данные работы для добавления/редактирования
     */
    private Map<String, Object> prepareWorkDataToUpdate(EditWorkDataRequest request,
                                                        IUUIDIdentifiable user)
    {
        GanttSettingsService ganttSettingsService = GanttSettingsService.instance

        String diagramKey =
            ganttSettingsService.generateDiagramKey(request.subjectUuid, request.contentCode)
        String ganttSettingsFromKeyValue = ganttSettingsService.getJsonSettings(diagramKey)

        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()

        Map<String, Object> preparedWorkData = request.workData
        Collection<IAttributeWrapper> attributes =
            api.metainfo.getMetaClass(request.classFqn).getAttributes()
        Map<String, Object> listAttributesEdits = [:]
        preparedWorkData.each {
            String attributeCode = it.key
            Object attributeValue = it.value
            IAttributeWrapper attribute
            if (attributeCode != 'title')
            {
                if (attributeCode.contains('@'))
                {
                    attributes =
                        api.metainfo.getMetaClass(attributeCode.split('@').first())?.getAttributes()
                    attribute = attributes.find {
                        it.code == attributeCode?.split('@')?.last()
                    }
                }
                else
                {
                    attribute = attributes.find {
                        it.code == attributeCode
                    }
                }

            }
            else
            {
                attribute = attributes?.find {
                    it.code == attributeCode
                }
                listAttributesEdits += [(attribute.code): request.workData.title]
            }
            if (attribute?.type?.code in AttributeType.DATE_TYPES)
            {
                String timezoneString =
                    api.employee.getTimeZone(user?.UUID)?.code ?: request.timezone
                TimeZone timezone = TimeZone.getTimeZone(timezoneString)
                attributeValue = Date.parse(WORK_DATE_PATTERN, attributeValue)
                listAttributesEdits += [(attribute?.code): (attributeValue)]
            }
            else if (attribute?.type?.code in AttributeType.LINK_TYPES)
            {
                listAttributesEdits += [(attribute?.code): (api.utils.get(attributeValue))]
            }
            else
            {
                listAttributesEdits += [(attribute?.code): (attributeValue)]
            }
        }
        Boolean editabilityStatus =
            api.metainfo.getMetaClass(request.classFqn).getAttribute('state').editable
        ResourceAndWorkSettings resourceWork = ganttSettings.resourceAndWorkSettings.find {
            it.type == SourceType.WORK
        }
        String checkpointStatusAttr = resourceWork.checkpointStatusAttr.code.split('@').last()
        if (request.workData.completed && editabilityStatus)
        {
            ScriptDtObject milestoneMetaObject = api.utils.get(request.workUUID)
            WorkflowWrapper workflow = api.metainfo.getMetaClass(milestoneMetaObject).workflow
            String endState =
                workflow.endState.code
            String statusForTransitionFromEndState =
                workflow.states.code.find {
                    workflow.isTransitionExists(
                        endState,
                        it
                    )
                }
            if (request.workData.completed.toBoolean())
            {
                Integer statusChangeCounter = 0
                changeStatusToFinal(milestoneMetaObject, endState, statusChangeCounter)
            }
            else
            {
                api.utils.edit(milestoneMetaObject, [state: statusForTransitionFromEndState])
            }
            listAttributesEdits += [state: statusForTransitionFromEndState]
        }
        return listAttributesEdits
    }

    /**
     * Метод изменения статуса на финальный
     * @param milestoneMetaObject - метаинформация о вехе на диаграмме
     * @param endState - код конечного статуса
     * @return подготовленные данные работы для добавления/редактирования
     */
    void changeStatusToFinal(ScriptDtObject milestoneMetaObject,
                             String endState,
                             Integer statusChangeCounter)
    {
        api.metainfo.getMetaClass(milestoneMetaObject).workflow.states.code.each {
            if (api.metainfo.getMetaClass(milestoneMetaObject).workflow.isTransitionExists(
                milestoneMetaObject.state,
                it
            ))
            {
                api.utils.edit(milestoneMetaObject, [state: it])
            }
        }
        if (milestoneMetaObject.state != endState && statusChangeCounter < 15)
        {
            changeStatusToFinal(milestoneMetaObject, endState, ++statusСhangeСounte)
        }
        else
        {
            return
        }
    }

    /**
     * Подготовка формата даты для изменений
     * @param preparedWorkData - основные данные из запроса
     * @param attributes - атрибуты метакласса
     * @param user - пользователь
     * @param request - тело запроса
     * @return подготовленные данные работы для добавления/редактирования
     */
    private Map<String, Object> checkingDateAttribute(Map<String, Object> preparedWorkData,
                                                      Collection<IAttributeWrapper> attributes,
                                                      IUUIDIdentifiable user,
                                                      EditWorkDataRequest request)
    {
        String formatEditedTime = WORK_DATE_PATTERN
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
                attributeValue = Date.parse(formatEditedTime, attributeValue, timezone)
                preparedWorkData[attributeCode] = attributeValue
            }
            try
            {
                attributeValue = api.utils.get(attributeValue)
                preparedWorkData[attributeCode] = attributeValue
            }
            catch (Exception ex)
            {
                logger.info('Переданный объект не является объектом')
            }
        }
        return preparedWorkData
    }

    /**
     * Метод обработки даты перед сохранением
     * @param request - тело запроса
     * @param user - пользователь
     * @return данные с датой в правильном формате
     */
    private Map<String, Object> prepareWorkDataToDate(AddNewWorkRequest request,
                                                      IUUIDIdentifiable user)
    {
        Map<String, Object> preparedWorkData = request.workData
    }

    private Map<String, Object> getTasksData(AddNewWorkRequest request, IUUIDIdentifiable user)
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
        if(workDeadlineAttribute == null){
            return false
        }
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

        return newDateToUpdate?.compareTo(entityDeadline) == 1
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
     * Информация об обязательных полях
     */
    Collection<Map<String, String>> attr
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

    /**
     * Идентификатор текущей карточки объекта
     */
    String subjectUuid
    /**
     * Код контента, на котором расположена диаграмма
     */
    String contentCode
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
