//Автор: atulisova
//Дата создания: 13.07.2021
//Код: ganttSettings
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Gantt".
 * Содержит методы для формирования и получения настроек по диаграмме
 */
//Версия SMP: 4.12
package ru.naumen.modules.gantt

import com.fasterxml.jackson.annotation.JsonInclude
import groovy.transform.Canonical
import groovy.transform.Field
import groovy.transform.Immutable
import groovy.transform.InheritConstructors
import ru.naumen.core.server.script.api.injection.InjectApi
import com.fasterxml.jackson.databind.ObjectMapper
import com.amazonaws.util.json.Jackson
import static com.amazonaws.util.json.Jackson.fromJsonString as fromJson
import ru.naumen.core.shared.IUUIDIdentifiable
import ru.naumen.core.server.script.api.metainfo.IAttributeWrapper
import com.fasterxml.jackson.annotation.JsonAutoDetect
import ru.naumen.core.server.script.spi.ScriptDtOMap
import ru.naumen.core.server.script.api.metainfo.*
import ru.naumen.core.shared.dto.ISDtObject

import static groovy.json.JsonOutput.toJson

@Field @Lazy @Delegate GanttSettingsController ganttSettings = new GanttSettingsImpl()

interface GanttSettingsController
{
    /**
     * Отдает список источников данных с детьми
     * @param classFqn код метакласса
     * @return json список источников данных {заголовок, код, дети}
     */
    String getDataSources()

    /**
     * Отдает список атрибутов для источника данных
     * @param requestContent запрос с кодом метакласса и типами атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    String getDataSourceAttributes(Map<String, Object> requestContent)

    /**
     * Отдает список атрибутов для  статуса контрольной точки
     * @param requestContent запрос с кодом метакласса и типами атрибутов
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    String getDataAttributesControlPointStatus(Map<String, Object> requestContent)

    /**
     * Отдает список групп атрибутов для источника данных
     * @param requestContent запрос с кодом метакласса
     * @return json список групп атрибутов {заголовок, код, метакласс}
     */
    String getDataSourceAttributeGroups(Map<String, Object> requestContent)

    /**
     * Метод получения настроек из хранилища
     * @param requestContent - тело запроса [subjectUUID:..., contentCode: ...]
     * @param user - текущий пользователь
     * @return настройки из хранилища
     */
    String getGanttSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод сохранение настроек в хранилища
     * @param requestContent - тело запроса [subjectUUID:..., contentCode: ..., ganttSettings: {}]
     * @return настройки, отправленные в хранилище
     */
    String saveGanttSettings(Map<String, Object> requestContent)

    /**
     * Метод получения названий и ключей версий диаграммы
     * @param requestContent - тело запроса
     * @return список названий и ключей диаграмм версий
     */
    String getGanttVersionTitlesAndKeys(Map<String, Object> requestContent)

    /**
     * Метод получения настроек из хранилища
     * @param versionKey - ключ версии диаграммы
     * @return настройки из хранилища
     */
    String getGanttVersionsSettings(String versionKey)

    /**
     * Метод сохранения настроек версии диаграммы
     * @param requestContent - тело запроса
     * @return настройки, отправленные в хранилище
     */
    String saveGanttVersionSettings(Map<String, Object> requestContent)

    /**
     * Метод применения версии на основную диаграмму
     * @param diagramData - данные о диаграмме
     */
    String applyVersion(Map<String, Object> diagramData)

    /**
     * Метод изменения полей в диаграмме версий
     * @param updateGanttVersionsSettingsRequest - настройки версии диаграммы
     * @param versionKey - ключ версии диаграммы
     * @return измененные настройки версии диаграммы
     */
    String updateGanttVersionSettings(UpdateGanttVersionsSettingsRequest updateGanttVersionsSettingsRequest,
                                      String versionKey)

    /**
     * Метод удаления версии диаграммы
     * @param versionKey - ключ версии диаграммы
     */
    String deleteGanttVersionSettings(String versionKey)

    /**
     * Получение данных о пользователе
     * @param requestContent - параметры запроса (classFqn, contentCode)
     * @param user - текущий пользователь
     * @return параметры пользователя
     */
    String getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)

    /**
     * Метод редактирования последовательности в работе
     * @param tasks - ссписок работы
     * @param versionKey - ключ версии диаграммы
     * @return измененные настройки версии диаграммы
     */
    String updateTasks(Collection<Map<String, String>> tasks, String versionKey)

    /**
     * Метод проверки возможности перемещения работы к новому ресурсу
     * @param requestContent - тело запроса
     * @return возможность перемещения работы
     */
    String checkWorksOfResource(Map<String, Object> requestContent)
}

@InheritConstructors
class GanttSettingsImpl implements GanttSettingsController
{
    GanttSettingsService service = GanttSettingsService.instance

    @Override
    String getDataSources()
    {
        return toJson(service.getDataSources())
    }

    @Override
    String getDataSourceAttributes(Map<String, Object> requestContent)
    {
        SourceAttributesRequest request = new ObjectMapper()
            .convertValue(requestContent, SourceAttributesRequest)
        return toJson(service.getDataSourceAttributes(request))
    }

    @Override
    String getDataAttributesControlPointStatus(Map<String, Object> requestContent)
    {
        SourceAttributesRequest request = new ObjectMapper()
            .convertValue(requestContent, SourceAttributesRequest)
        return toJson(service.getDataAttributesControlPointStatus(request))
    }

    @Override
    String getDataSourceAttributeGroups(Map<String, Object> requestContent)
    {
        BaseGanttSettingsRequest request = new ObjectMapper()
            .convertValue(requestContent, BaseGanttSettingsRequest)
        return toJson(service.getDataSourceAttributeGroups(request))
    }

    @Override
    String getGanttSettings(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        GetGanttSettingsRequest request = new ObjectMapper()
            .convertValue(requestContent, GetGanttSettingsRequest)
        return Jackson.toJsonString(service.getGanttSettings(request))
    }

    @Override
    String saveGanttSettings(Map<String, Object> requestContent)
    {
        SaveGanttSettingsRequest request = new ObjectMapper()
            .convertValue(requestContent, SaveGanttSettingsRequest)
        return Jackson.toJsonString(service.saveGanttSettings(request))
    }

    @Override
    String getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.getUserData(requestContent, user))
    }

    @Override
    String getGanttVersionTitlesAndKeys(Map<String, Object> requestContent)
    {
        return Jackson.toJsonString(service.getGanttVersionTitlesAndKeys(requestContent))
    }

    @Override
    String getGanttVersionsSettings(String versionKey)
    {
        return Jackson.toJsonString(service.getGanttVersionsSettings(versionKey))
    }

    @Override
    String saveGanttVersionSettings(Map<String, Object> requestContent)
    {
        SaveGanttVersionSettingsRequest request = new ObjectMapper()
            .convertValue(requestContent, SaveGanttVersionSettingsRequest)
        return Jackson.toJsonString(service.saveGanttVersionSettings(request))
    }

    @Override
    String applyVersion(Map<String, Object> diagramData)
    {
        SavingChangesChart request = new ObjectMapper()
            .convertValue(diagramData, SavingChangesChart)
        return Jackson.toJsonString(service.applyVersion(request))
    }

    @Override
    String updateGanttVersionSettings(UpdateGanttVersionsSettingsRequest updateGanttVersionsSettingsRequest,
                                      String versionKey)
    {
        UpdateGanttVersionsSettingsRequest request = new ObjectMapper()
            .convertValue(updateGanttVersionsSettingsRequest, UpdateGanttVersionsSettingsRequest)
        return Jackson.toJsonString(service.updateGanttVersionSettings(request, versionKey))
    }

    @Override
    String deleteGanttVersionSettings(String versionKey)
    {
        return Jackson.toJsonString(service.deleteGanttVersionSettings(versionKey))
    }

    @Override
    String updateTasks(Collection<Map<String, String>> tasks, String versionKey)
    {
        return Jackson.toJsonString(service.updateTasks(tasks, versionKey))
    }

    @Override
    String checkWorksOfResource(Map<String, Object> requestContent)
    {
        CheckWorksOfResourceData requestData = new ObjectMapper()
            .convertValue(requestContent, CheckWorksOfResourceData)
        return toJson(service.checkWorksOfResource(requestData))
    }
}

@InjectApi
@Singleton
class GanttSettingsService
{
    private static final String GANTT_VERSION_DATE_PATTERN = "dd.MM.yyyy, HH:mm:ss"
    private static final String MAIN_FQN = 'abstractBO'
    private static final String GROUP_GANT_MASTER = 'GanttMaster'
    private static final String GROUP_MASTER_DASHBOARD = 'sys_dashboardMaster'
    static final String GANTT_NAMESPACE = 'gantts'
    static final String TYPE_SELECT = 'select'
    static final String GANTT_VERSION_NAMESPACE = 'ganttVersions'
    private static final String DATA_TYPE_OBJECT = 'object'

    static final List<String> ATTRIBUTE_TYPES_ALLOWED_FOR_EDITION = [
        AttributeType.CATALOG_ITEM_TYPE,
        AttributeType.CATALOG_ITEM_SET_TYPE,
        AttributeType.BO_LINKS_TYPE,
        AttributeType.OBJECT_TYPE,
        AttributeType.STATE_TYPE,
        AttributeType.BOOL_TYPE,
        AttributeType.DATE_TIME_TYPE,
        AttributeType.DATE_TYPE,
        AttributeType.INTEGER_TYPE,
        AttributeType.STRING_TYPE
    ]

    /**
     * Отдает список источников данных с детьми
     * @param classFqn код метакласса
     * @return json список источников данных {заголовок, код, дети}
     */
    Collection<GanttDataSource> getDataSources(String classFqn = MAIN_FQN)
    {
        def children = getMetaClassChildren(classFqn)
        return children.collectMany {
            mappingDataSource(it)
        }.sort {
            it.title
        }
    }

    /**
     * Отдает список атрибутов для источника данных
     * @param requestContent - тело запроса [classFqn:.., parentClassFqn:.., types:..]
     * classFqn - метакласс, в котором искать; parentClassFqn - класс, на который атрибут может ссылаться
     * types - список типов, по которым атрибут можно ограничить
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    Collection<Attribute> getDataSourceAttributes(SourceAttributesRequest request)
    {
        def metaInfo = api.metainfo.getMetaClass(request.classFqn)
        def metaClassTypes = api.metainfo.getTypes(request.classFqn)
        List<String> parentMetaClassCodes = []

        if (request.parentClassFqn)
        {
            def metaClass = api.metainfo.getMetaClass(request.parentClassFqn)
            parentMetaClassCodes << metaClass.code
            while (metaClass = metaClass.parent)
            {
                parentMetaClassCodes << metaClass.code
            }
        }

        Collection<Attribute> attributes = ([metaInfo] + metaClassTypes).collectMany { mc ->
            def attributes = request.types
                ? mc?.attributes?.findAll {
                it.type.code in request.types ? it : null
            }
                : mc?.attributes?.toList()

            if (request.parentClassFqn)
            {
                attributes = attributes.findAll {
                    it.type.code in AttributeType.LINK_TYPES &&
                    it.type.relatedMetaClass.code in parentMetaClassCodes ? it : null
                }
            }

            return attributes
                ? mappingAttribute(attributes, mc.title, mc.code)
                : []
        }.unique {
            it.code
        }.sort {
            it.title
        }

        if (request.isForColumns)
        {
            attributes = attributes.findAll() {
                it.type in ATTRIBUTE_TYPES_ALLOWED_FOR_EDITION
            }
        }
        //attributes = attributes.findAll() {it.type != 'object'}
        return attributes
    }
    /**
     * Отдает список атрибутов для источника данных
     * @param request - тело запроса
     * @return json список атрибутов {заголовок, код, тип атрибута}
     */
    Collection<Attribute> getDataAttributesControlPointStatus(SourceAttributesRequest request)
    {
        IMetaClassWrapper metaInfo = api.metainfo.getMetaClass(request.classFqn)
        Collection<IMetaClassWrapper> metaClassTypes = api.metainfo.getTypes(request.classFqn)
        Collection<Attribute> attributes = ([metaInfo] + metaClassTypes).collectMany { mc ->
            Collection attributes = mc?.attributes?.findAll {
                it.type.code == 'date' || it.type.code == 'dateTime'
            }
            return attributes
                ? mappingAttribute(attributes, mc.title, mc.code)
                : []
        }.unique {
            it.code
        }.sort {
            it.title
        }
        return attributes
    }

    /**
     * Отдает список групп атрибутов для источника данных
     * @param request - тело запроса (объект класа BaseGanttSettingsRequest)
     * @return json список групп атрибутов {заголовок, код, метакласс}
     */
    Collection<AttributeGroup> getDataSourceAttributeGroups(BaseGanttSettingsRequest request)
    {
        String classFqn = request.classFqn

        def metaInfo = api.metainfo.getMetaClass(classFqn)
        def metaClassTypes = api.metainfo.getTypes(classFqn)

        return ([metaInfo] + metaClassTypes).collectMany { mc ->
            def attributeGroups = mc?.attributeGroups?.toList()
            return attributeGroups
                ? mappingAttributeGroups(attributeGroups, mc.code)
                : []
        }.unique {
            it.code
        }.sort {
            it.title
        }
    }

    /**
     * Метод получения настроек из хранилища
     * @param request - тело запроса
     * @return настройки из хранилища
     */
    GanttSettingsClass getGanttSettings(GetGanttSettingsRequest request)
    {
        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode

        String diagramKey = generateDiagramKey(subjectUUID, contentCode)
        String ganttSettingsFromKeyValue = getJsonSettings(diagramKey)
        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()
        ganttSettings.diagramKey = diagramKey
        changingSettingsForNonTextTypes(ganttSettings)
        transformGanttSettings(ganttSettings)

        return ganttSettings
    }

    /**
     * Метод изменения настроек для не строковых типов данных
     * @param ganttSettings - настройки из хранилища
     */
    void changingSettingsForNonTextTypes(GanttSettingsClass ganttSettings)
    {
        ganttSettings.commonSettings?.columnSettings?.each { columnSetting ->
            if (!columnSetting.editor)
            {
                columnSetting.editor = new EditorTextData()
            }
            ganttSettings.resourceAndWorkSettings.each { resourceAndWorkSetting ->
                if (resourceAndWorkSetting.type == SourceType.WORK)
                {
                    resourceAndWorkSetting.attributeSettings.each { attributeSetting ->
                        if (attributeSetting.code ==
                            columnSetting.code && attributeSetting.attribute.type)
                        {
                            String metaClassFqn = attributeSetting.attribute.metaClassFqn
                            String attributeCode = attributeSetting.attribute.code
                            String type = attributeSetting.attribute.type
                            columnSetting.editor.type = attributeSetting.attribute.type
                            IAttributeWrapper getAtribute =
                                api.metainfo.getMetaClass(metaClassFqn).getAttribute(attributeCode)
                            switch (columnSetting.editor.type)
                            {
                                case AttributeType.STRING_TYPE:
                                    columnSetting.editor.options = null
                                    columnSetting.editor.type = 'text'
                                    break
                                case AttributeType.CATALOG_ITEM_SET_TYPE:
                                case AttributeType.CATALOG_ITEM_TYPE:
                                    attributeCode = attributeSetting.attribute.property
                                    columnSetting.editor.type = TYPE_SELECT
                                    Set elementsDirectory = []
                                    api.utils.find(attributeCode, [:]).findAll().each {
                                        elementsDirectory.add(
                                            ['label': it.title,
                                             'key'  : it.title,
                                             'value': it.UUID]
                                        )
                                    }
                                    columnSetting.editor.options = elementsDirectory
                                    break
                                case AttributeType.INTEGER_TYPE:
                                    columnSetting.editor.options = null
                                    columnSetting.editor.type = 'number'
                                    columnSetting.editor.map_to = 'integer'
                                    break
                                case AttributeType.DATE_TYPE:
                                case AttributeType.DATE_TIME_TYPE:
                                    columnSetting.editor.options = null
                                    columnSetting.editor.type = 'date'
                                    break
                                case AttributeType.OBJECT_TYPE:
                                    Set newOptionsColumnSetting = []
                                    columnSetting.editor.type = TYPE_SELECT
                                    String referenceClass =
                                        api.metainfo.getMetaClass(metaClassFqn)
                                           .getAttribute(attributeCode)
                                           .getType().getRelatedMetaClass().toString()
                                    api.utils.find(referenceClass, [:]).findAll().each {
                                        newOptionsColumnSetting.add(
                                            ['label': it.title,
                                             'key': it.title,
                                             'value': it.UUID]
                                        )
                                    }
                                    columnSetting.editor.options = newOptionsColumnSetting
                                    break
                                case AttributeType.BOOL_TYPE:
                                    Set newOptionsColumnSetting = []
                                    columnSetting.editor.type = TYPE_SELECT
                                    newOptionsColumnSetting
                                        .add(['label': 'да', 'key': 'да', 'value': true])
                                    newOptionsColumnSetting
                                        .add(['label': 'нет', 'key': 'нет', 'value': false])
                                    columnSetting.editor.options = newOptionsColumnSetting
                                    break
                                case AttributeType.STATE_TYPE:
                                    Set newOptionsColumnSetting = []
                                    columnSetting.editor.type = TYPE_SELECT
                                    api.metainfo.getMetaClass(metaClassFqn).workflow.states.each {
                                        newOptionsColumnSetting.add(
                                            ['label': it.title, 'key': it.title, 'value': it.code]
                                        )
                                    }
                                    columnSetting.editor.options = newOptionsColumnSetting
                                    break
                                default:
                                    columnSetting.editor.options = null
                                    columnSetting.editor.type = 'text'
                                    break
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Метод сохранение настроек в хранилища
     * @param request - тело запроса
     * @return настройки, отправленные в хранилище
     */
    GanttSettingsClass saveGanttSettings(SaveGanttSettingsRequest request)
    {
        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode
        GanttSettingsClass ganttSettings = request.ganttSettings

        String ganttSettingsKey = generateDiagramKey(subjectUUID, contentCode)
        String currentGanttSettingsJSON = getJsonSettings(ganttSettingsKey)

        GanttSettingsClass currentGanttSettings = currentGanttSettingsJSON
            ? Jackson.fromJsonString(currentGanttSettingsJSON, GanttSettingsClass)
            : new GanttSettingsClass()

        ganttSettings.workRelations = currentGanttSettings.workRelations

        ganttSettings.commonSettings = updateColumnsInCommonSettings(ganttSettings.commonSettings)
        if (saveJsonSettings(subjectUUID, toJson(ganttSettings)) && saveJsonSettings(
            request?.ganttSettings?.diagramKey,
            toJson(ganttSettings)
        ))
        {
            return ganttSettings
        }
        else
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод получения названий и ключей версий диаграммы
     * @param requestContent - тело запроса
     * @return список названий и ключей версий диаграммы
     */
    Collection<Map<String, String>> getGanttVersionTitlesAndKeys(Map<String, Object> requestContent)
    {
        String ganttSettingsJsonValue = getJsonSettings(requestContent.subjectUuid)

        GanttSettingsClass ganttSettings = ganttSettingsJsonValue
            ? Jackson.fromJsonString(ganttSettingsJsonValue, GanttSettingsClass)
            : new GanttSettingsClass()

        Collection<String> versionKeysToRemove = []
        Collection<Map<String, String>> result = ganttSettings.diagramVersionsKeys.findResults {
            String subjectUuidInKey = it.split('_').first()
            String contentCode = it.split('_')[1]
            GanttVersionsSettingsClass ganttVersionSettings = getGanttVersionsSettings(it)
            if (ganttVersionSettings?.title &&
                subjectUuidInKey ==
                requestContent.subjectUuid &&
                requestContent.diagramKey.split('_').last() == contentCode)
            {
                return [
                    'title'     : ganttVersionSettings.title,
                    'diagramKey': ganttVersionSettings.versionKey
                ]
            }
            else
            {
                versionKeysToRemove << it
                return null
            }
        }
        ganttSettings.diagramVersionsKeys -= versionKeysToRemove
        return result
    }

    /**
     * Метод получения настроек из хранилища
     * @param versionKey - ключ диаграммы версий
     * @return настройки из хранилища
     */
    GanttVersionsSettingsClass getGanttVersionsSettings(String versionKey)
    {

        String diagramVersionValueFromKey = getJsonSettings(versionKey, GANTT_VERSION_NAMESPACE)

        GanttVersionsSettingsClass ganttVersionSettings = diagramVersionValueFromKey
            ? Jackson.fromJsonString(diagramVersionValueFromKey, GanttVersionsSettingsClass)
            : new GanttVersionsSettingsClass()

        return ganttVersionSettings
    }

    /**
     * Сохраняет настройки версии диаграммы
     * @param request - тело запроса
     * @return настройки версии
     */
    GanttVersionsSettingsClass saveGanttVersionSettings(SaveGanttVersionSettingsRequest request)
    {
        GanttDataSetService ganttDataSetService = GanttDataSetService.instance

        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode
        String diagramKey = generateDiagramKey(subjectUUID, contentCode)

        String ganttSettingsFromKeyValue = getJsonSettings(subjectUUID)
        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()
        String versionKey = [subjectUUID, contentCode, UUID.randomUUID().toString()].join('_')

        Date createdDate = Date.parse(GANTT_VERSION_DATE_PATTERN, request.createdDate)

        ganttSettings.diagramVersionsKeys << versionKey
        ganttSettings.diagramVersionsKeys = ganttSettings.diagramVersionsKeys.unique()
        ganttSettings.diagramKey = diagramKey
        Collection<SequenceChartElements> sequenceWorks = []
        request.tasks.each
            {
                if (it.type in ['WORK', 'milestone'])
                {
                    SequenceChartElements elements = new SequenceChartElements()
                    elements.parentUuid = it.parent
                    elements.workUuid = it.id
                    elements.idLocations = it.positionElement ?: null
                    sequenceWorks.add(elements)
                }
            }
        saveJsonSettings(
            String.join('_', 'sequenceWorks', versionKey),
            toJson(sequenceWorks)
        )
        if (!saveJsonSettings(subjectUUID, Jackson.toJsonString(ganttSettings)))
        {
            throw new Exception('Настройки не были сохранены!')
        }

        /**
         * Маппинг атрибутов и метаклассов, чтобы было понятно какой атрибут отвечает за начальную/конечную дату для какого метакласса
         */
        Map<String, Map<String, String>> mapAttributes = [:]
        ganttSettings.resourceAndWorkSettings.each {
            if (it.type == SourceType.WORK)
            {
                String startAttributeCode = it.startWorkAttribute.code
                String endAttributeCode = it.endWorkAttribute.code
                String metaClassCode = it.source.value.value

                if (metaClassCode.contains('$'))
                {
                    metaClassCode = metaClassCode.split('\\$').first()
                }

                mapAttributes[metaClassCode] = ['start_date': startAttributeCode,
                                                'end_date'  : endAttributeCode]
            }
        }

        GanttVersionsSettingsClass ganttVersionSettings = new GanttVersionsSettingsClass(
            title: request.title,
            createdDate: createdDate,
            versionKey: versionKey,
            ganttSettings: ganttSettings
        )

        List<Map<String, Object>> data = ganttDataSetService
            .buildDataListFromSettings(ganttSettings.resourceAndWorkSettings, null, subjectUUID)

        request.tasks.each {
            DiagramEntity entity = new DiagramEntity()
            entity.entityUUID = it.id
            entity.attributesData.title = it.text
            if (it.parent)
            {
                entity.parent = it.parent
            }
            entity.sourceType = it.type
            entity.editable = it.editable
            entity.workOfLink = it.workOfLink
            entity.datesStartDateAndEndDate = it.datesStartDateAndEndDate
            entity.editable = it.editable
            entity.name = it.name
            entity.level = it.level
            entity.positionElement = it.positionElement ?: null

            request.commonSettings.columnSettings.each { column ->
                if (it[column.code])
                {
                    entity.dataTableColumns[column.code] = it[column.code]
                }
            }

            if (it?.containsKey('completed'))
            {
                entity.completed = it.completed
            }

            String metaClassCode = entity.entityUUID.split('\\$').first()
            Map<String, String> metaClassMapAttributes = mapAttributes[metaClassCode]

            if (metaClassMapAttributes)
            {
                entity.attributesData[metaClassMapAttributes.start_date] = it.start_date
                entity.attributesData[metaClassMapAttributes.end_date] = it.end_date
            }
            ganttVersionSettings.diagramEntities << entity
        }

        ganttVersionSettings.workRelations = request.workRelations
        ganttVersionSettings.commonSettings = request.commonSettings

        Map attributesForColumns = [:]
        request.commonSettings.columnSettings.each {
            attributesForColumns << [(it.code): (request.tasks.find { task -> task[it.code]
            }[it.code])]
        }

        if (saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GANTT_VERSION_NAMESPACE
        ))
        {
            return ganttVersionSettings
        }
        else
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод применения версии на основную диаграмму
     * @param diagramData - ифнормация для внесения изменений
     */
    void applyVersion(SavingChangesChart diagramData)
    {
        String versionKey = diagramData.diagramKey
        Collection<Map<String, Object>> tasks = diagramData.tasksClone
        String ganttVersionSettingsJsonValue = getJsonSettings(diagramData.diagramKey)

        GanttSettingsClass ganttVersionSettings = ganttVersionSettingsJsonValue
            ? Jackson.fromJsonString(ganttVersionSettingsJsonValue, GanttSettingsClass)
            : new GanttSettingsClass()

        ResourceAndWorkSettings resourceWork = ganttVersionSettings.resourceAndWorkSettings.find {
            it.type == SourceType.WORK
        }
        String communicationResourceAttribute = resourceWork.communicationResourceAttribute.code
        String startWorkAttribute = resourceWork.startWorkAttribute.code.split('@').last()
        String endWorkAttribute = resourceWork.endWorkAttribute.code.split('@').last()
        String checkpointStatusAttr = resourceWork.checkpointStatusAttr.code.split('@').last()
        Map editableDataInSystem = [:]
        ISDtObject metaObjectWork
        tasks.findAll { it -> it.type == 'WORK'
        }.each { task ->
            metaObjectWork = api.utils.get(task.id)
            if (metaObjectWork[communicationResourceAttribute].UUID != task.parent)
            {
                editableDataInSystem << [(communicationResourceAttribute):
                                         api.utils.get(task.parent)]
            }
            editableDataInSystem << [(startWorkAttribute): getDateToSave(task.start_date)]
            editableDataInSystem << [(endWorkAttribute): getDateToSave(task.end_date)]
            api.utils.edit(metaObjectWork, editableDataInSystem)
        }
        tasks.findAll { it -> it.type == 'milestone'
        }.each { task ->
            metaObjectWork = api.utils.get(task.id)
            editableDataInSystem << [(checkpointStatusAttr): getDateToSave(task.start_date)]
            api.utils.edit(metaObjectWork, editableDataInSystem)
        }
        ganttVersionSettings.workRelations = diagramData.workRelations
        if (!saveJsonSettings(diagramData.diagramKey, toJson(ganttVersionSettings)))
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод преобразования даты из строки в класс Date
     * @param attributeValue - даты в строковом виде
     * @return дата в корректном виде
     */
    Date getDateToSave(String attributeValue)
    {
        String formatEditedTime = "yyyy-MM-dd'T'HH:mm:ss"
        String timezoneString = 'Europe/Moscow'
        TimeZone timezone = TimeZone.getTimeZone(timezoneString)
        Date attributeDate = Date.parse(formatEditedTime, attributeValue, timezone)
        return attributeDate
    }

    /**
     * Метод проверки возможности перемещения работы к новому ресурсу
     * @param requestContent - тело запроса
     * @return возможность перемещения работы
     */
    Boolean checkWorksOfResource(CheckWorksOfResourceData requestContent)
    {
        String versionKey = requestContent.diagramKey
        String ganttVersionSettingsJsonValue = getJsonSettings(requestContent.diagramKey)

        GanttSettingsClass ganttVersionSettings = ganttVersionSettingsJsonValue
            ? Jackson.fromJsonString(ganttVersionSettingsJsonValue, GanttSettingsClass)
            : new GanttSettingsClass()
        ResourceAndWorkSettings resourceWork = ganttVersionSettings.resourceAndWorkSettings.find {
            it.type == SourceType.WORK
        }
        String communicationResourceAttribute =
            resourceWork.communicationResourceAttribute.code.split('@').last()
        String metaClassFqn = resourceWork.communicationResourceAttribute.metaClassFqn
        Boolean movingWorkWithinCurrentResource
        api.utils.edit(
            api.utils.get(requestContent.workId),
            [(communicationResourceAttribute): api.utils.get(requestContent.resourceId)]
        )
        String getKeyData = requestContent.versionKey ?: requestContent.diagramKey
        String keySequenceWork = String.join('_', 'sequenceWorks', getKeyData)
        String dataChartElements = getJsonSettings(keySequenceWork)
        Collection chartElements = dataChartElements
            ? fromJson(dataChartElements, Collection)
            : []
        Collection listEditableObjects = chartElements.findAll {
            it.parentUuid == requestContent.resourceId
        }
        Collection listEditable = []
        Integer sequenceNumberLocations
        listEditableObjects.eachWithIndex { num, idx ->
            if (idx < requestContent.positionElement)
            {
                listEditable << num
            }
            if (idx == requestContent.positionElement)
            {
                listEditable << ['parentUuid' : requestContent.resourceId,
                                 'workUuid'   : requestContent.workId,
                                 'idLocations': idx]
                sequenceNumberLocations = idx
                listEditable << ['parentUuid' : num.parentUuid,
                                 'workUuid'   : num.workUuid,
                                 'idLocations': ++sequenceNumberLocations]

            }
            if (idx > requestContent.positionElement)
            {
                if (requestContent.workId != num.workUuid)
                {
                    num.idLocations = ++sequenceNumberLocations
                    listEditable << num
                }
            }
        }
        String keyForGettingDataFromStorage = requestContent.versionKey ?: requestContent.diagramKey
        GanttVersionsSettingsClass ganttVersionsSettings =
            getGanttVersionsSettings(keyForGettingDataFromStorage)
        ganttVersionsSettings.diagramEntities.each { ganttVer ->
            Map elem = listEditable.find { editable ->
                editable.workUuid == ganttVer.entityUUID
            }
            if (elem)
            {
                ganttVer.positionElement = elem.idLocations
            }
        }
        saveJsonSettings(requestContent.versionKey, toJson(ganttVersionsSettings))
    }

    /**
     * Метод изменения полей в диаграмме версий
     * @param updateGanttVersionsSettingsRequest - настройки версии диаграммы
     * @param versionKey - ключ версии диаграммы
     * @return измененные настройки версии диаграммы
     */
    GanttVersionsSettingsClass updateGanttVersionSettings(UpdateGanttVersionsSettingsRequest updateGanttVersionsSettingsRequest,
                                                          String versionKey)
    {
        String ganttVersionSettingsJsonValue = getJsonSettings(versionKey, GANTT_VERSION_NAMESPACE)

        GanttVersionsSettingsClass ganttVersionSettings = ganttVersionSettingsJsonValue
            ? Jackson.fromJsonString(ganttVersionSettingsJsonValue, GanttVersionsSettingsClass)
            : new GanttVersionsSettingsClass()

        ganttVersionSettings.title = updateGanttVersionsSettingsRequest.title
        ganttVersionSettings.ganttSettings = updateGanttVersionsSettingsRequest.ganttSettings

        if (saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GANTT_VERSION_NAMESPACE
        ))
        {
            return ganttVersionSettings
        }
        else
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод по удалению версии диаграммы
     * @param versionKey - ключ версии диаграммы
     */
    void deleteGanttVersionSettings(String versionKey)
    {
        api.keyValue.delete(GANTT_VERSION_NAMESPACE, versionKey)
    }

    /**
     * Получение данных о пользователе
     * @param requestContent - параметры запроса (classFqn, contentCode)
     * @param user - текущий пользователь
     * @return параметры пользователя
     */
    Map getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        String classFqn = requestContent.classFqn
        String contentCode = requestContent.contentCode
        String groupUser = getUserGroup(user)
        return [groupUser: groupUser,
                name     : user?.title,
                email    : user?.email]
    }

    /**
     * Метод преобразования некоторых данных диаграммы
     * @param ganttSettings - данные диаграммы
     */
    private void transformGanttSettings(GanttSettingsClass ganttSettings)
    {
        if (ganttSettings.commonSettings)
        {
            Boolean columnForWorkAdditionExists = ganttSettings.commonSettings.columnSettings.any {
                it.code == 'add'
            }
            //if (!columnForWorkAdditionExists)
            //{
            //    ganttSettings.commonSettings.columnSettings << new ColumnSettings(
            //        show: true,
            //        code: 'add',
            //        title: ''
            //    )
            //}
        }
    }

    /**
     * Метод получения группы пользователя
     * @param user - пользователь
     * @return группа
     */
    private String getUserGroup(IUUIDIdentifiable user)
    {
        if (!user)
        {
            return "SUPER"
        }
        else if (checkUserOnMasterDashboard(user))
        {
            return "ganttMaster"
        }
        else
        {
            return "REGULAR"
        }
    }

    /**
     * Метод проверки пользователя на мастера дашборда
     * @param user
     * @return
     */
    private boolean checkUserOnMasterDashboard(IUUIDIdentifiable user)
    {
        return user?.UUID
            ? ((GROUP_GANT_MASTER in api.utils.get(user.UUID).all_Group*.code) ||
               (GROUP_MASTER_DASHBOARD in api.utils.get(user.UUID).all_Group*.code))
            : true
    }

    /**
     * Метод доработки колонок в настройках общего блока
     * @param commonSettings - настройки общего блока
     * @return обновленные настройки общего блока
     */
    private CommonSettings updateColumnsInCommonSettings(CommonSettings commonSettings)
    {
        commonSettings?.columnSettings?.each { columnSettings ->
            if (columnSettings && !columnSettings.code)
            {
                columnSettings.code = UUID.randomUUID()
            }
        }
        return commonSettings
    }

    /**
     * Маппинг из коллекция кодов всех атрибутов метакласса в Collection<AttributeGroup>
     * Collection<fqnAttrGroup> -> Collection<AttributeGroup>
     * @param attributeGroups - группы атрибутов метакласа
     * @param sourceCode - код типа объекта
     * @return коллекция группы атрибутов
     */
    private Collection<AttributeGroup> mappingAttributeGroups(List attributeGroups,
                                                              String sourceCode)
    {
        return attributeGroups.findResults { value ->
            return new AttributeGroup(
                code: value.code,
                title: value.title,
                classFqn: sourceCode
            )
        }
    }

    /**
     * Маппинг из коллекция кодов всех атрибутов метакласса в Collection<Attribute>
     * Collection<fqnAttr> -> Collection<Attribute>
     * @param attributes - атрибуты метакласа
     * @param sourceName - название типа объекта
     * @param sourceCode - код типа объекта
     */
    private Collection<Attribute> mappingAttribute(List attributes,
                                                   String sourceName,
                                                   String sourceCode)
    {
        return attributes.findResults {
            !it.computable && it.type.code in AttributeType.ALL_ATTRIBUTE_TYPES ?
                buildAttribute(it, sourceName, sourceCode) : null
        }.sort {
            it.title
        }
    }

    /**
     * Метод создания атрибута в структуре необхоимой фронту
     * @param value - значение атрибута
     * @param sourceName - название источника
     * @param sourceCode - код источника
     * @return атрибут в структуре необхоимой фронту
     */
    private Attribute buildAttribute(def value, String sourceName, String sourceCode)
    {
        return new Attribute(
            code: getAttributeCode(value),
            label: value.title,
            value: getAttributeCode(value),
            title: value.title,
            type: value.type.code as String,
            property: value.type.relatedMetaClass as String,
            metaClassFqn: value.metaClass.code,
            declaredMetaClass: value.declaredMetaClass,
            sourceName: sourceName,
            sourceCode: sourceCode
        )
    }

    /**
     * Метод получения правильного кода атрибута для запроса в БД
     * @param systemAttribute - атрибут в системе
     * @return правильный  атрибута для запроса в БД
     */
    private String getAttributeCode(def systemAttribute)
    {
        Boolean attrSignedInClass = systemAttribute.declaredMetaClass.fqn.isClass()
        if (!attrSignedInClass)
        {
            return systemAttribute.attributeFqn.toString()
        }
        return systemAttribute.code
    }

    /**
     * Метод генерации ключа сохраненной диаграммы
     * @param subjectUUID - уникальный идентификатор объекта, на карточке которого расположена диаграмма
     * @param contentCode - код контента, который нахолится на карточке
     * @return сгенерированный ключ сохраненной диаграммы
     */
    String generateDiagramKey(String subjectUUID, String contentCode)
    {
        String type = api.utils.get(subjectUUID)?.metaClass?.toString()
        return "${ type }_${ contentCode }"
    }

    /**
     * Метод загрузки настроек по ключу объекта
     * @param key - уникальный идентификатор объекта
     * @return сериализованные настройки объекта
     */
    String getJsonSettings(String key, String namespace = GANTT_NAMESPACE)
    {
        return api.keyValue.get(namespace, key)
    }

    /**
     * Метод сохранения настроек объекта
     * @param key - уникальный идентификатор объекта
     * @param jsonValue - ыериализованные настройки объекта
     * @return true/false успешное/провалльное сохранение
     */
    Boolean saveJsonSettings(String key, String jsonValue, String namespace = GANTT_NAMESPACE)
    {
        return api.keyValue.put(namespace, key, jsonValue)
    }

    /**
     * Метод получения списка метаклассов и типов
     * @param fqn код метакласса
     * @return список детей 1 уровня
     */
    private def getMetaClassChildren(String fqn)
    {
        Closure classValidator = { clazz ->
            !clazz.@metaClass.isHidden() && clazz.@metaClass.status.name() != 'REMOVED'
        }
        return api.metainfo.getMetaClass(fqn)?.children?.collectMany {
            if (classValidator.call(it))
            {
                return [it]
            }
            else if (it.toString() == 'userEntity')
            {
                return it.children.findAll(classValidator)
            }
            return []
        }
    }

    /**
     * Маппинг из списка объектов, идентифицирующий метакласс в список источников данных
     * Collection<fqn> -> Collection<GanttDataSource>
     * @param fqns - fqn-ы
     */
    private Collection<GanttDataSource> mappingDataSource(def fqns)
    {
        Closure classValidator = { clazz ->
            !clazz.@metaClass.isHidden() && clazz.@metaClass.status.name() != 'REMOVED'
        }
        return fqns.collect {
            new GanttDataSource(
                it.code,
                it.title,
                mappingDataSource(
                    it.children.findAll {
                        classValidator.call(it)
                    }
                )
            )
        }.sort {
            it.title
        }
    }

    /**
     * Метод редактирования последовательности в работе
     * @param tasks - ссписок работы
     * @param versionKey - ключ версии диаграммы
     * @return измененные настройки версии диаграммы
     */
    Collection<Map<String, String>> updateTasks(Collection<Map<String, String>> tasks,
                                                String versionKey)
    {
        String ganttVersionSettingsJsonValue = getJsonSettings(versionKey, GANTT_VERSION_NAMESPACE)

        GanttVersionsSettingsClass ganttVersionSettings = ganttVersionSettingsJsonValue
            ? Jackson.fromJsonString(ganttVersionSettingsJsonValue, GanttVersionsSettingsClass)
            : new GanttVersionsSettingsClass()

        ganttVersionSettings.tasks = tasks
        Boolean saveSettings = saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionSettings),
            GANTT_VERSION_NAMESPACE
        )
        if (saveSettings)
        {
            return ganttVersionSettings.tasks
        }
        else
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }
}

/**
 * Перечисление значений для масштабов
 */
enum ScaleEnum
{
    HOUR,
    DAY,
    WEEK,
    MONTH,
    QUARTER,
    YEAR
}

/**
 * Состояние работы в версии диаграммы
 */
enum StatusWork
{
    DELETED,
    ADDED,
    EDITED
}

/**
 * Тип источника
 */
enum SourceType
{
    WORK,
    RESOURCE,
    MILESTONE
}

/**
 * Тип даты у работы для редактирования
 */
enum WorkEditDateType
{
    startDate,
    endDate
}

/**
 * Тело базового запроса (на получение необходимых данных для настроек)
 */
@Canonical
class BaseRequest
{
    /**
     * Код метакласса
     */
    String classFqn
}

/**
 * Тело запроса на получение атрибутов источника
 */
@Canonical
class SourceAttributesRequest extends BaseRequest
{
    /**
     * Список типов
     */
    List<String> types
    /**
     * Код метакласса "родителя" (нужно на получение атрибутов связи для вложенных работ/ресурсов)
     */
    String parentClassFqn
    /**
     * Флаг на получение атрибутов для связи с колонками
     */
    Boolean isForColumns = false
}

@Canonical
class SourceAttributesRequestForControlPointStatus extends BaseRequest
{
    /**
     * Код метакласса "родителя" (нужно на получение атрибутов связи для вложенных работ/ресурсов)
     */
    String parentClassFqn
}

/**
 * Базовый класс для запроса по настройкам диаграммы Ганта
 */
class BaseGanttSettingsRequest
{
    /**
     * Ключ текущей карточки объекта
     */
    String subjectUUID
    /**
     * Ключ контента, на котором расположена диаграмма
     */
    String contentCode
}

/**
 * Тело запроса на получение настроек диаграммы Ганта
 */
class GetGanttSettingsRequest extends BaseGanttSettingsRequest
{
    /**
     * Таймзона устройства пользователя
     */
    String timezone
}

/**
 * Тело запроса на получение настроек по отдельным версиям диаграммы Ганта
 */
class GetGanttSettingsRequestVersion extends BaseGanttSettingsRequest
{
    /**
     * Таймзона устройства пользователя
     */
    String timezone

    String versionKey
}

/**
 * Тело запроса на сохранение настроек диаграммы Ганта
 */
class SaveGanttSettingsRequest extends BaseGanttSettingsRequest
{
    /**
     * Настройки диаграммы Ганта
     */
    GanttSettingsClass ganttSettings
}

/**
 * Тело запроса на сохранение настроек диаграммы версий Ганта
 */
class SaveGanttVersionSettingsRequest extends BaseGanttSettingsRequest
{
    /**
     * Название версии
     */
    String title
    /**
     * Дата создания версии
     */
    String createdDate
    /**
     * Изменения в задачах
     */
    Collection<Map<String, Object>> tasks

    /**
     * Связи между работами
     */
    Collection workRelations

    /**
     * Настройки для столбцов бокового меню
     */
    CommonSettings commonSettings
}

/**
 * Тело запроса на сохранение настроек диаграммы версий Ганта
 */
class SavingChangesChart
{
    /**
     * Ключ для получения настроек диаграммы
     */
    String diagramKey

    /**
     * Изменения в работах
     */
    Collection<Map<String, Object>> tasksClone

    /**
     * Связи между работами
     */
    Collection workRelations

    /**
     * Код контента
     */
    String contentCode

    /**
     * UUID объекта
     */
    String subjectUuid
}

/**
 * Базовый класс для настроек и данных диаграммы Ганта
 */
class BaseGanttDiagramData
{
    /**
     * Настройки общего блока
     */
    CommonSettings commonSettings

    /**
     * Ключ диаграммы
     */
    String diagramKey

    /**
     * Настройки связей между работами
     */
    Collection<WorkRelation> workRelations = []

    /**
     * Данные о прогрессе работ
     */
    Map<String, Double> workProgresses = [:]

    /**
     * Отображение прогресса выполнения работ на диаграмме
     */
    Boolean progressCheckbox

    /**
     * Отображение связи работ на диаграмме
     */
    Boolean workRelationCheckbox

    /**
     * Отображение контрольных точек
     */
    Boolean milestonesCheckbox

    /**
     * Отображение состояния контрольных точек
     */
    Boolean stateMilestonesCheckbox

    /**
     * Отображение работы с открытыми датами
     */
    Boolean worksWithoutStartOrEndDateCheckbox
}

/**
 * Настройки диаграммы Ганта для настройки технологом
 */
class GanttSettingsClass extends BaseGanttDiagramData
{
    /**
     * Настройки для источников - ресурсов/работ
     */
    Collection<ResourceAndWorkSettings> resourceAndWorkSettings
    /**
     * Настройки для источников - версий диаграмм Ганта
     */
    Collection<String> diagramVersionsKeys = []
    /**
     * Настройки для источников - старт работ
     */
    String startDate
    /**
     * Настройки для источников - окончание работ
     */
    String endDate
    /**
     * Настройки интервала
     */
    CurrentInterval currentInterval
}

/**
 * Настройки версий диаграммы Ганта для настройки технологом
 */
class GanttVersionsSettingsClass
{
    /**
     * Настройки для источников - работ
     */
    Collection<DiagramEntity> diagramEntities = []
    /**
     * Ключ диаграммы версий
     */
    String versionKey
    /**
     * Название диаграммы
     */
    String title
    /**
     * Дата создания диаграммы
     */
    Date createdDate
    /**
     * Настройки диаграммы версий
     */
    GanttSettingsClass ganttSettings

    /**
     * Настройки связей между работами
     */
    Collection workRelations = []

    /**
     * Настройки для столбцов
     */
    CommonSettings commonSettings
}

/**
 * Класс, описывающий запрос на обновления версии диаграммы
 */
class UpdateGanttVersionsSettingsRequest
{
    /**
     * Название диаграммы
     */
    String title
    /**
     * Настройки диаграммы версий
     */
    GanttSettingsClass ganttSettings
}

/**
 * Класс, описывающий запрос на проверку перемещаемости работы
 */
class CheckWorksOfResourceData
{
    /**
     * Ключ диаграммы
     */
    String diagramKey

    /**
     * Идентификатор ресурса
     */
    String resourceId

    /**
     * Идентификатор работы
     */
    String workId

    /**
     * Позиция элемента
     */
    Integer positionElement

    /**
     * Версия диаграммы
     */
    String versionKey
}

/**
 * Класс, описывающий сущности, сохраненные в версии диаграммы
 */
class DiagramEntity
{
    /**
     * Данные атрибутов сущности
     */
    Map<String, Object> attributesData = [:]

    /**
     * Данные для столбцов таблицы
     */
    Map<String, Object> dataTableColumns = [:]

    /**
     * Состояние сущности
     */
    StatusWork statusWork
    /**
     * UUID сущности
     */
    String entityUUID
    /**
     * Код метакласса сущности
     */
    String classFqn
    /**
     * Тип сущности
     */
    String sourceType
    /**
     * UUID ресурса для работы
     */
    String parent

    /**
     * Разрешение на внесение правок в работу
     */
    Boolean editable

    /**
     * Ссылка на работу
     */
    String workOfLink

    /**
     * Наличие даты начала и даты окончания работ
     */
    Boolean datesStartDateAndEndDate

    /**
     * Имя
     */
    String name

    /**
     * Уровень
     */
    Integer level

    /**
     * Завершенность работы
     */
    Boolean completed

    /**
     * Позиция элемента
     */
    Integer positionElement
}

/**
 * Связь между работами
 */
class WorkRelation
{
    /**
     * Разрешение на внесение правок в работу
     */
    Boolean editable
    /**
     * ID работ
     */
    String id
    /**
     * UUID работы A
     */
    String source

    /**
     * UUID работы B
     */
    String target

    /**
     * Тип отношений между работами
     */
    String type
}

/**
 * Данные диаграммы Ганта для построения
 */
class GanttDiagramData extends BaseGanttDiagramData
{
    /**
     * Данные для построения диаграммы
     */
    Collection<Map<String, Object>> tasks = []
    /**
     * Коды групп атрибутов, сгруппированные по метаклассу работ
     */
    Map<String, Collection> attributesMap = [:]
    /**
     * Список обязательных атрибутов матакласса
     */
    Map<String, Collection> mandatoryAttributes  = [:]
    /**
     * Настройки для источников - старт работ
     */
    String startDate
    /**
     * Настройки для источников - окончание работ
     */
    String endDate
    /**
     * Настройки интервала
     */
    CurrentInterval currentInterval
}

/**
 * Настройки общего блока
 */
class CommonSettings
{
    /**
     * Масштаб
     */
    ScaleEnum scale

    /**
     * Свернуть работы по умолчанию
     */
    Boolean rollUp

    /**
     * Настройки столбцов таблицы
     */
    Collection<ColumnSettings> columnSettings
}

/**
 * Настройка для обязательных атрибутов
 */
class MandatoryAttributesInformation
{
    /**
     * Имя атрибута
     */
    String title
    /**
     * Тип атрибута
     */
    String type
    /**
     * Код атрибута
     */
    String code
    /**
     * Базовые настройки для выпадающих списков
     */
    Map<String, Collection> options
}

/**
 * Настройка текущего интревала на диаграмме
 */
class CurrentInterval
{
    /**
     * Метка опций
     */
    String label
    /**
     * Значения опций
     */
    String value
}

/**
 * Настройки столбцов таблицы
 */
class ColumnSettings extends TitleAndCode
{
    /**
     * Флаг на отображение
     */
    Boolean show

    /**
     * Настройки для редактирования атрибута
     */
    EditorTextData editor

    /**
     * Максимальная ширина колонки
     */
    String max_width

    /**
     * Минимальная ширина колонки
     */
    String min_width

}

/**
 * Настройки колонки для редактирования атрибута
 */
class Editor
{
    /**
     * Название атрибута для колонки
     */
    String type

}

class EditorTextData extends Editor
{
    /**
     * Поле для определения типа данных
     */
    String map_to = 'text'

    /**
     * Множество опций для вывода объектов
     */
    Set options = null
}

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
class DataDropDown
{
    /**
     * Имя элемента
     */
    String label

    /**
     * Ключ элемента
     */
    String key

    /**
     * Значение для бэка
     */
    Set value

    DataDropDown(String label, String key, String value)
    {
        this.label = label
        this.key = key
        this.value = value
    }
}

/**
 * Типы атрибутов даннных для диаграмм
 */
class AttributeType
{

    static final Collection<String> ALL_ATTRIBUTE_TYPES = [OBJECT_TYPE, TIMER_TYPE, BACK_TIMER_TYPE,
                                                           BO_LINKS_TYPE, BACK_BO_LINKS_TYPE,
                                                           CATALOG_ITEM_TYPE, CATALOG_ITEM_SET_TYPE,
                                                           META_CLASS_TYPE, DT_INTERVAL_TYPE,
                                                           DATE_TYPE,
                                                           DATE_TIME_TYPE, STRING_TYPE,
                                                           INTEGER_TYPE, DOUBLE_TYPE, STATE_TYPE,
                                                           LOCALIZED_TEXT_TYPE, BOOL_TYPE]
        .asImmutable()
    static final Collection<String> TIMER_TYPES = [TIMER_TYPE, BACK_TIMER_TYPE].asImmutable()
    static final Collection<String> LINK_TYPES_WITHOUT_CATALOG = [OBJECT_TYPE, BO_LINKS_TYPE,
                                                                  BACK_BO_LINKS_TYPE].asImmutable()
    static final Collection<String> LINK_TYPES = [OBJECT_TYPE, CATALOG_ITEM_TYPE,
                                                  CATALOG_ITEM_SET_TYPE, BO_LINKS_TYPE,
                                                  BACK_BO_LINKS_TYPE].asImmutable()
    static final Collection<String> LINK_SET_TYPES = [CATALOG_ITEM_SET_TYPE, BO_LINKS_TYPE,
                                                      BACK_BO_LINKS_TYPE].asImmutable()
    static final Collection<String> NUMBER_TYPES = [INTEGER_TYPE, DOUBLE_TYPE].asImmutable()
    static final Collection<String> DATE_TYPES = [DATE_TYPE, DATE_TIME_TYPE].asImmutable()
    static final Collection<String> HAS_UUID_TYPES = [*LINK_TYPES, STATE_TYPE, META_CLASS_TYPE]

    static final String OBJECT_TYPE = 'object'

    static final String TIMER_TYPE = 'timer'
    static final String BACK_TIMER_TYPE = 'backTimer'
    static final String BO_LINKS_TYPE = 'boLinks'
    static final String CATALOG_ITEM_SET_TYPE = 'catalogItemSet'

    static final String BACK_BO_LINKS_TYPE = 'backBOLinks'
    static final String CATALOG_ITEM_TYPE = 'catalogItem'
    static final String META_CLASS_TYPE = 'metaClass'
    static final String DT_INTERVAL_TYPE = 'dtInterval'

    static final String DATE_TYPE = 'date'
    static final String DATE_TIME_TYPE = 'dateTime'
    static final String STRING_TYPE = 'string'
    static final String INTEGER_TYPE = 'integer'

    static final String DOUBLE_TYPE = 'double'
    static final String STATE_TYPE = 'state'
    static final String LOCALIZED_TEXT_TYPE = 'localizedText'
    static final String BOOL_TYPE = 'bool'
    static final String TOTAL_VALUE_TYPE = 'totalValue'
    static final String VALUE_TYPE = 'value'
}

/**
 * Атрибут
 */
class Attribute extends TitleAndCode
{
    /**
     * Тип атрибута
     */
    String type
    /**
     * Свойство атрибута (метаклассы ссылочных атрибутов, значения элементов справочника и т.д)
     */
    String property
    /**
     * метакласс атрибута(где к нему идёт обращение)
     */
    String metaClassFqn
    /**
     * метакласс атрибута, где он был создан
     */
    String declaredMetaClass
    /**
     * Имя источника
     */
    String sourceName
    /**
     * Код источника
     */
    String sourceCode
    /**
     * Значение атрибута
     */
    String value

    /**
     * Вложенный атрибут
     */
    Attribute ref

    /**
     * Значение для отображения в списке
     */
    String label

    static Attribute fromMap(Map<String, Object> data)
    {
        return data ? new Attribute(
            title: data.title as String,
            code: data.code as String,
            type: data.type as String,
            property: data.property as String,
            metaClassFqn: data.metaClassFqn as String,
            declaredMetaClass: data.declaredMetaClass as String,
            sourceName: data.sourceName as String,
            sourceCode: data.sourceCode as String,
            ref: fromMap(data.ref as Map<String, Object>)
        ) : null
    }

    /**
     * Метод получения цепочки атрибутов списком
     * @return Список атрибутов.
     */
    List<Attribute> attrChains()
    {
        return this.ref ? [this] + this.ref.attrChains() : [this]
    }

    /**
     * Полное копирование атрибута включая вложенные
     * @return
     */
    Attribute deepClone()
    {
        return new Attribute(
            code: this.code,
            title: this.title,
            type: this.type,
            property: this.property,
            metaClassFqn: this.metaClassFqn,
            declaredMetaClass: this.declaredMetaClass,
            sourceName: this.sourceName,
            sourceCode: this.sourceCode,
            ref: this.ref?.deepClone()
        )
    }

    /**
     * Добавление атрибута последним в цепочке
     * @param attribute - атрибут
     */
    void addLast(Attribute attribute)
    {
        if (this.ref)
        {
            this.ref.addLast(attribute)
        }
        else
        {
            this.ref = attribute
        }
    }

    /**
     * Метод, возвращающий тип атрибута
     * @param attr - атрибут
     * @return тип атрибута
     */
    static String getAttributeType(Attribute attr)
    {
        return attr?.attrChains()?.last()?.type
    }
}

/**
 * Настройки для источников данных
 */
class ResourceAndWorkSettings
{
    /**
     * Номер ресурса/работы
     */
    String id

    /**
     * Номер родителя, от которого зависит
     */
    String parent

    /**
     * Тип источника - работа/ресурс
     */
    SourceType type

    /**
     * Настройки для метакласса и фильтрации (работа/ресурс)
     */
    Source source

    /**
     * Уровень вложенности
     */
    Integer level

    /**
     * Признак вложенности
     */
    Boolean nested

    /**
     * Связь с вышестоящим ресурсом
     */
    Attribute communicationResourceAttribute

    /**
     * Связь с вышестоящей работой
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Attribute communicationWorkAttribute

    /**
     * Настройки атрибутов для таблицы
     */
    Collection<AttributeSettings> attributeSettings

    /**
     * Атрибут начала работ
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Attribute startWorkAttribute

    /**
     * Атрибут окончания работ
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Attribute endWorkAttribute

    /**
     * Атрибут статуса контрольной точки
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Attribute checkpointStatusAttr

    /**
     * Группа атрибутов на добавление работ
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    AttributeGroup addAttributeGroup

    /**
     * Группа атрибутов на редактирование работ
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    AttributeGroup editAttributeGroup
}

/**
 * Настройки для метакласса и фильтрации (работа/ресурс)
 */
class Source
{
    /**
     * Фильтрация на источник
     */
    String descriptor

    /**
     * Значение метакласса
     */
    SourceValue value
}

/**
 * Значение метакласса
 */
class SourceValue
{
    /**
     * Название метакласса
     */
    String label
    /**
     * Код метакласса
     */
    String value
}

/**
 * Настройки атрибутов для таблицы
 */
class AttributeSettings extends TitleAndCode
{
    /**
     * Атрибут метакласса
     */
    Attribute attribute
}

/**
 * Модель для источника данных
 */
@Immutable
class GanttDataSource
{
    /**
     * Код типа метакласса
     */
    String classFqn
    /**
     * Название источника данных
     */
    String title
    /**
     * Дети источника даннных
     */
    Collection<GanttDataSource> children
}

/**
 * Настройки группы атрибутов
 */
class AttributeGroup extends TitleAndCode
{
    /**
     * Метакласс для группы
     */
    String classFqn
}

/**
 * Базовый класс для всех тех, где есть название и код
 */
class TitleAndCode
{
    /**
     * Название
     */
    String title

    /**
     * Код
     */
    String code
}

/**
 * Класс с информацией о последовательности элементов
 */
class SequenceChartElements
{
    /**
     * Uuid родительского элемента
     */
    String parentUuid

    /**
     * Uuid текущего элемента
     */
    String workUuid

    /**
     * Идентификатор расположения
     */
    Integer idLocations
}
