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
import ru.naumen.core.shared.IUUIDIdentifiable

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
     * Отдает список групп атрибутов для источника данных
     * @param diagramKey ключ основной диаграммы
     * @return json список групп атрибутов {заголовок, код, дата}
     */
    String getGanttVersionsSettings(String diagramKey)

    /**
     * Сохраняет настройки версий диаграммы в хранилище
     * @param requestContent - тело запроса [title:..., createDate: ..., code / key]
     * @return настройки, отправленные в хранилище
     */
    String saveGanttVersion(Map<String, Object> requestContent)

    /**
     * Метод изменения полей в диаграмме версий
     * @param ganttVersionsSettingsClass - настройки диаграммы версий
     * @param versionKey - ключ диаграммы версий
     * @return измененные настройки диаграммы версий
     */
    GanttVersionsSettingsClass updateGanttVersionSettings(GanttVersionsSettingsDTOClass ganttVersionsSettingsDTO,
                                                          String versionKey)

    /**
     * Метод удаления диаграмм версий из хранилища
     * @param ganttVersionId - индексы значений
     */
    void deleteGanttVersionSettings(int ganttVersionId)

    /**
     * Получение данных о пользователе
     * @param requestContent - параметры запроса (classFqn, contentCode)
     * @param user - текущий пользователь
     * @return параметры пользователя
     */
    String getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)
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
    String getGanttVersionsSettings(String diagramKey)
    {
        return Jackson.toJsonString(service.getGanttVersionsSettings(diagramKey))
    }

    @Override
    String saveGanttVersion(Map<String, Object> requestContent)
    {
        SaveGanttVersionSettingsRequest request = new ObjectMapper()
            .convertValue(requestContent, SaveGanttVersionSettingsRequest)
        return Jackson.toJsonString(service.saveGanttVersionSettings(request))
    }

    @Override
    GanttVersionsSettingsClass updateGanttVersionSettings(GanttVersionsSettingsDTOClass ganttVersionsSettingsDTO,
                                                          String versionKey)
    {
        GanttVersionsSettingsDTOClass request = new ObjectMapper().
            convertValue(ganttVersionsSettingsDTO, GanttVersionsSettingsDTOClass)
        return Jackson.toJsonString(service.updateGanttVersionSettings(request, versionKey))
    }

    @Override
    void deleteGanttVersionSettings(int ganttVersionId)
    {
        service.deleteGanttVersionSettings(ganttVersionId)
    }

    @Override
    String getUserData(Map<String, Object> requestContent, IUUIDIdentifiable user)
    {
        return toJson(service.getUserData(requestContent, user))
    }
}

@InjectApi
@Singleton
class GanttSettingsService
{
    private static final String GANTT_NAMESPACE = 'gantts'
    private static final String GANTT_VERSION_NAMESPACE = 'ganttVersions'
    private static final String GANTT_VERSION_DATE_PATTERN = "yyyy-MM-dd'T'HH:mm:ss"
    private static final String MAIN_FQN = 'abstractBO'
    private static final String OLD_GROUP_MASTER_DASHBOARD = 'MasterDashbordov'
    private static final String GROUP_MASTER_DASHBOARD = 'sys_dashboardMaster'
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
                    it.type.relatedMetaClass.code == request.parentClassFqn ? it : null
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
            attributes = attributes.findAll {
                it.type in ATTRIBUTE_TYPES_ALLOWED_FOR_EDITION
            }
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
        transformGanttSettings(ganttSettings)
        addingEditor(ganttSettings)
        return ganttSettings
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

        String ganttSettingsKey =
            ganttSettings?.diagramKey ?: generateDiagramKey(subjectUUID, contentCode)

        String currentGanttSettingsJSON = getJsonSettings(ganttSettingsKey)

        GanttSettingsClass currentGanttSettings = currentGanttSettingsJSON
            ? Jackson.fromJsonString(currentGanttSettingsJSON, GanttSettingsClass)
            : new GanttSettingsClass()

        ganttSettings.workRelations = currentGanttSettings.workRelations

        ganttSettings.commonSettings = updateColumnsInCommonSettings(ganttSettings.commonSettings)

        if (saveJsonSettings(ganttSettingsKey, Jackson.toJsonString(ganttSettings)))
        {
            return ganttSettings
        }
        else
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод получения настроек из хранилища
     * @param diagramKey - ключ диаграммы
     * @return настройки из хранилища
     */
    Collection<GanttVersionsSettingsClass> getGanttVersionsSettings(String diagramKey)
    {
        String diagramValue = getJsonSettings(diagramKey)

        GanttSettingsClass ganttSettings = diagramValue
            ? Jackson.fromJsonString(diagramValue, GanttSettingsClass)
            : new GanttSettingsClass()

        return ganttSettings.diagramVersionsKeys.collect {
            String diagramVersionValue = getJsonSettings(it, GANTT_VERSION_NAMESPACE)
            GanttVersionsSettingsClass ganttVersionsSettings = diagramVersionValue
                ? Jackson.fromJsonString(diagramVersionValue, GanttVersionsSettingsClass)
                : new GanttVersionsSettingsClass()
            return ganttVersionsSettings
        }
    }

    /**
     * Метод получения настроек из хранилища
     * @param versionKey - ключ диаграммы версий
     * @return настройки из хранилища
     */
    GanttVersionsSettingsClass getGanttVersionsSettingsFromDiagramVersionKey(String versionKey)
    {
        String diagramVersionValueFromKey = getJsonSettings(versionKey, GANTT_VERSION_NAMESPACE)

        GanttVersionsSettingsClass ganttVersionsSettings = diagramVersionValueFromKey
            ? Jackson.fromJsonString(diagramVersionValueFromKey, GanttVersionsSettingsClass)
            : new GanttVersionsSettingsClass()

        return ganttVersionsSettings
    }

    /**
     * Сохраняет настройки версий диаграммы в хранилище
     * @param request - тело запроса
     * @return настройки, отправленные в хранилище
     */
    GanttVersionsSettingsClass saveGanttVersionSettings(SaveGanttVersionSettingsRequest request)
    {
        String subjectUUID = request.subjectUUID
        String contentCode = request.contentCode
        String ganttSettingsKey = generateDiagramKey(subjectUUID, contentCode)
        String versionKey = UUID.randomUUID().toString()
        Date createdDate = Date.parse(GANTT_VERSION_DATE_PATTERN, request.createdDate)
        GanttDataSetService ganttDataSetService = GanttDataSetService.instance

        String ganttSettingsFromKeyValue = getJsonSettings(ganttSettingsKey)

        GanttSettingsClass ganttSettings = ganttSettingsFromKeyValue
            ? Jackson.fromJsonString(ganttSettingsFromKeyValue, GanttSettingsClass)
            : new GanttSettingsClass()
        ganttSettings.diagramVersionsKeys.add(versionKey)

        Boolean saveJsonSettingsGantt = saveJsonSettings(
            ganttSettings.diagramKey,
            Jackson.toJsonString(ganttSettings)
        )

        if (!saveJsonSettingsGantt)
        {
            throw new Exception('Настройки не были сохранены!')
        }

        Work work = new Work()
        Map<String, Map<String, String>> mapAttributes = [:]

        ganttSettings.resourceAndWorkSettings.each {
            if (it.type == SourceType.WORK)
            {
                String startAttributeCode = it.startWorkAttribute.code
                String endAttributeCode = it.endWorkAttribute.code
                mapAttributes[it.source.value.value] = ['start_date': startAttributeCode,
                                                        'end_date'  : endAttributeCode]
            }
        }

        GanttVersionsSettingsClass ganttVersionsSettings = new GanttVersionsSettingsClass(
            title: request.title,
            createdDate: createdDate,
            versionKey: versionKey,
            ganttSettings: ganttSettings
        )

        List<Map<String, Object>> data =
            ganttDataSetService
                .buildDataListFromSettings(ganttSettings.resourceAndWorkSettings, null)

        Map<String, String> valueForMapAttributes = [:]
        Map<String, Object> mapAttributesWork = [:]
        String startDateCode = null
        String endDateCode = null
        data.each {
            String id = it.id
            String startDateValue = it.startDate
            String endDateValue = it.endDate
            String metaClassName = id.substring(id.indexOf(""), id.lastIndexOf('$'))
            valueForMapAttributes = mapAttributes.get(metaClassName)

            if (valueForMapAttributes)
            {
                startDateCode = valueForMapAttributes.get("start_date")
                endDateCode = valueForMapAttributes.get("end_date")

                mapAttributesWork.id = id
                mapAttributesWork.startDateCode = startDateValue
                mapAttributesWork.endDateCode = endDateValue

                Map<String, Map<String, Object>> mapWorks =
                    work.attributesData.put(metaClassName, mapAttributesWork)
            }
        }

        Boolean saveJsonSettingsGanttVersion = saveJsonSettings(
            versionKey,
            Jackson.toJsonString(ganttVersionsSettings),
            GANTT_VERSION_NAMESPACE
        )

        if (saveJsonSettingsGanttVersion)
        {
            return ganttVersionsSettings
        }
        else
        {
            throw new Exception('Настройки не были сохранены!')
        }
    }

    /**
     * Метод изменения полей в диаграмме версий
     * @param ganttVersionsSettingsClass - настройки диаграммы версий
     * @param versionKey - ключ диаграммы версий
     * @return измененные настройки диаграммы версий
     */
    GanttVersionsSettingsClass updateGanttVersionSettings(GanttVersionsSettingsDTOClass ganttVersionsSettingsDTO,
                                                          String versionKey)
    {
        String versionSettings = getJsonSettings(versionKey, GANTT_VERSION_NAMESPACE)

        GanttVersionsSettingsClass ganttVersionsSettings = versionSettings
            ? Jackson.fromJsonString(versionSettings, GanttVersionsSettingsClass)
            : new GanttVersionsSettingsClass()

        ganttVersionsSettings.title = ganttVersionsSettingsDTO.title
        ganttVersionsSettings.ganttSettings = ganttVersionsSettingsDTO.ganttSettings

        ganttVersionsSettings = api.keyValue.put(
            GANTT_VERSION_NAMESPACE,
            versionKey,
            toJson(ganttVersionsSettings)
        )

        return ganttVersionsSettings
    }

    /**
     * Метод удаления диаграмм версий из хранилища
     * @param ganttVersionId - индексы значений
     */
    void deleteGanttVersionSettings(int ganttVersionId)
    {
        api.keyValue.delete(GANTT_VERSION_NAMESPACE, ganttVersionId)
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
        Boolean columnForWorkAdditionExists = ganttSettings.commonSettings.columnSettings.any {
            it.code == 'add'
        }
        if (!columnForWorkAdditionExists)
        {
            ganttSettings.commonSettings.columnSettings << new ColumnSettings(
                show: true,
                code: 'add',
                title: ''
            )
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
            return "MASTER"
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
            ? ((OLD_GROUP_MASTER_DASHBOARD in api.utils.get(user.UUID).all_Group*.code) ||
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

    private Attribute buildAttribute(def value, String sourceName, String sourceCode)
    {
        return new Attribute(
            code: getAttributeCode(value),
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
     * @return true/false успешное/провальное сохранение
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
 * Тип источника
 */
enum SourceType
{
    WORK,
    RESOURCE
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
 * Тело запроса на получение настроек версий диаграммы Ганта
 */
class GetGanttVersionsSettingsRequest extends BaseGanttSettingsRequest
{
    /**
     * Таймзона устройства пользователя
     */
    String timezone
}

/**
 * Тело запроса на сохранение настроек диаграммы версий Ганта
 */
class SaveGanttVersionSettingsRequest
{
    /**
     * Название версии
     */
    String title
    /**
     * Дата создания
     */
    String createdDate
    /**
     * Код
     */
    String contentCode
    /**
     * Ключ диаграммы
     */
    String subjectUUID
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
    Collection<Work> works = []
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
}

class GanttVersionsSettingsDTOClass
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

class Work
{
    Map<String, Map<String, Object>> attributesData = [:]
}

/**
 * Связь между работами
 */
class WorkRelation
{
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
    def tasks
    /**
     * Карта групп атрибутов по метаклассу работы
     */
    Map<String, Collection> attributesMap = [:]
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
 * Данные версий диаграммы Ганта для построения
 */
class GanttVersionDiagramData extends GanttDiagramData
{
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
     * Настройки для источников - ресурсов/работ
     */
    Collection<ResourceAndWorkSettings> resourceAndWorkSettings
    /**
     * Настройки для источников - версий диаграмм Ганта
     */
    Collection<String> diagramVersionsKeys = []
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
    Editor editor
}

/**
 * Настройки колонки для редактирования атрибута
 */
class Editor
{
    /**
     * Тип атрибута в колонке
     */
    String type

    /**
     * Название атрибута для колонки
     */
    String map_to
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
