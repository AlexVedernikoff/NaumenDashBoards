//Автор: NordClan
//Дата создания: 07.10.2021
//Код: verification
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Verification".
 * Содержит методы для проведения проверок обращения.
 */
//Версия SMP: 4.11.5

package ru.naumen.modules.verification

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Field

import static groovy.json.JsonOutput.toJson
import ru.naumen.core.shared.IUUIDIdentifiable
import com.amazonaws.util.json.Jackson
import ru.naumen.core.server.script.spi.IScriptUtils
import ru.naumen.core.server.script.api.IMetainfoApi
import ru.naumen.core.server.script.api.ISecurityApi
import ru.naumen.core.server.script.api.ITypesApi


@Field @Lazy @Delegate VerificationController verification = new VerificationImpl(new VerificationService(api.utils, api.metainfo, api.security, api.types))

interface VerificationController
{
    /**
     * Метод получения стартовых настроек для отображения проверок
     * @param claimUUID - уникальный идентификатор обращения
     * @param user - текущий пользователь
     * @return стартовые настройки для отображения проверок
     */
    String getStartSettings(Map<String, Object> requestContent)

    /**
     * Метод получения списка атрибутов и их значений для вывода на карточках проверки
     * @return список атрибутов для вывода на карточках проверки
     */
    String getVerificationList()

    /**
     * Метод по установке значений в атрибут обращения, а также статуса в задаче на проверку по 123-ФЗ
     * @param requestContent - тело запроса
     */
    String setValueAndTaskState(Map<String, Object> requestContent)
}

class VerificationImpl implements VerificationController
{
    private final VerificationService service

    VerificationImpl(VerificationService service)
    {
        this.service = service
    }

    private ObjectMapper mapper = new ObjectMapper()

    @Override
    String getStartSettings(Map<String, Object> requestContent)
    {
        GetStartSettingsRequest request = mapper.convertValue(requestContent, GetStartSettingsRequest)
        return Jackson.toJsonString(service.getStartSettings(request))
    }

    @Override
    String getVerificationList()
    {
        return Jackson.toJsonString(service.getVerificationList())
    }

    @Override
    String setValueAndTaskState(Map<String, Object> requestContent)
    {
        SetValueAndTaskStateRequest request = mapper.convertValue(requestContent, SetValueAndTaskStateRequest)
        return Jackson.toJsonString(service.setValueAndTaskState(request))
    }
}

class VerificationService
{
    private final IScriptUtils utils
    private final IMetainfoApi metainfo
    private final ISecurityApi security
    private final ITypesApi types

    VerificationService(IScriptUtils utils, IMetainfoApi metainfo, ISecurityApi security, ITypesApi types)
    {
        this.utils = utils
        this.metainfo = metainfo
        this.security = security
        this.types = types
    }

    private static final String TEAM_TITLE_TO_FIND = 'Управление данными'

    /**
     * Метод получения стартовых настроек для отображения проверок
     * @param claimUUID - уникальный идентификатор обращения
     * @param user - текущий пользователь
     * @return стартовые настройки для отображения проверок
     */
    StartSettings getStartSettings(GetStartSettingsRequest request)
    {
        String claimUUID = request.claimUUID
        IUUIDIdentifiable claim = utils.get(claimUUID)
        IUUIDIdentifiable task = claim.tasks.find { it.metaClass.toString() == MetaClasses.TASK_METACLASS }

        VerificationState verificationState = getVerificationState(task)
        Boolean userIsAbleToVerify = checkIfUserAbleToVerify(claim)
        Collection<VerificationValue> verification = getVerificationValues(claim, verificationState)
        String message = getVerificationMessage(verificationState ,task.state, verification.any())

        return new StartSettings(verificationState, userIsAbleToVerify, message, verification)
    }

    /**
     * Метод получения списка атрибутов и их значений для вывода на карточках проверки
     * @return список атрибутов для вывода на карточках проверки
     */
    Collection<Attribute> getVerificationList()
    {
        def metainfo = metainfo.getMetaClass(MetaClasses.CLAIM_METACLASS)
        return AttributeCode.VERIFICATION_ATTRIBUTE_CODES.findResults { code ->
            def systemAttribute = metainfo.getAttribute(code)
            def clazz = systemAttribute.type.attributeType.permittedTypes.find()
            List<Value> values =  utils.find(clazz, [:]).findResults { return new Value(title: it.title, UUID: it.UUID, code: it.code) }
            return new Attribute(title: systemAttribute.title,
                                 code: code,
                                 values: values,
                                 listType: code in AttributeCode.CHECKBOX_ATTRIBUTE_CODES ? ListType.CHECK : ListType.RADIO)
        }
    }

    /**
     * Метод по установке значений в атрибут обращения, а также статуса в задаче на проверку по 123-ФЗ
     * @param request - экземпляр класса SetValueAndTaskStateRequest
     */
    SetValueAndTaskStateResponse setValueAndTaskState(SetValueAndTaskStateRequest request)
    {
        IUUIDIdentifiable claim = utils.get(request.claimUUID)
        IUUIDIdentifiable task = claim.tasks.find { it.metaClass.toString() == MetaClasses.TASK_METACLASS }
        String attributeCode = request.code
        Collection values = request.values.findResults { return utils.get(it.UUID) }

        String state = getState(attributeCode, values, claim.get(AttributeCode.RIGHTC_CONCEDE))
        setAttributeValues(claim, attributeCode, values)
        Boolean fullChecked = state == TaskState.FULL_CHECK
        String message
        if(fullChecked)
        {
            message = VerificationMessages.IF_TASK_STATE_FULL_CHECK
            Boolean ableToSetValue = false
            AttributeCode.VERIFICATION_ATTRIBUTE_CODES.each {
                ableToSetValue = ableToSetValue || it == attributeCode
                if(ableToSetValue && it != attributeCode)
                {
                    setAttributeValues(claim, it, [])
                }
            }
        }
        setTaskState(task, attributeCode, state)

        if(attributeCode == AttributeCode.CHECK_FIN_SERV)
        {
            createClaimTask(task, claim, values.find())
        }
        return new SetValueAndTaskStateResponse(fullChecked, message)
    }

    /**
     * Метод получения заполненных значений по атрибутам проверки для обращения
     * @param claim - обращение
     * @param verificationState - состояние проверок
     * @return список заполненных значений по атрибутам проверки для обращения
     */
    private Collection<VerificationValue> getVerificationValues(IUUIDIdentifiable claim, VerificationState verificationState)
    {
        if (verificationState == VerificationState.VERIFICATION_FINISHED)
        {
            def metainfo = metainfo.getMetaClass(MetaClasses.CLAIM_METACLASS)
            return AttributeCode.VERIFICATION_ATTRIBUTE_CODES.findResults {
                if (claim.get(it))
                {
                    def systemAttribute = metainfo.getAttribute(it)
                    return new VerificationValue(title: systemAttribute.title, values: claim.get(it)*.title)
                }
            }
        }

    }

    /**
     * Метод получения статуса проверки
     * @param task - задача на проверку по 123-ФЗ
     * @return статус проверки
     */
    private VerificationState getVerificationState(IUUIDIdentifiable task)
    {
        switch (task.state)
        {
            case TaskState.IN_VERIFICATION_STATES:
                return VerificationState.IN_VERIFICATION
            case TaskState.CLOSED:
                return VerificationState.VERIFICATION_FINISHED
            default:
                return VerificationState.NO_VERIFICATION
        }
    }


    /**
     * Метод проверки прав пользователя на редактирование значений атрибутов обращения
     * @param claim - объект обращения
     * @return флаг на возможность изменения значений во всех атрибутах проверки
     */
    private Boolean checkIfUserAbleToVerify(IUUIDIdentifiable claim)
    {
        return AttributeCode.VERIFICATION_ATTRIBUTE_CODES.every {
            return security.hasEditPermission(claim, it)
        }
    }

    /**
     * Метод формирования сообщения
     * @param verificationState - состояние проверки
     * @param taskState - статус задачи на проверку по 123-ФЗ
     * @return сформированное сообщение
     */
    private String getVerificationMessage(VerificationState verificationState, String taskState, Boolean anyVerifications)
    {
        if(verificationState == VerificationState.NO_VERIFICATION)
        {
            switch (taskState)
            {
                case TaskState.REGISTERED:
                    return VerificationMessages.IF_TASK_STATE_REGISTERED
                case TaskState.INPROGRESS:
                    return VerificationMessages.IF_TASK_STATE_INPROGRESS
                case TaskState.FULL_CHECK:
                    return VerificationMessages.IF_TASK_STATE_FULL_CHECK
                default:
                    return VerificationMessages.NOT_AVAILABLE
            }
        }
        if(verificationState == VerificationState.VERIFICATION_FINISHED && !anyVerifications)
        {
            return VerificationMessages.VERIFICATION_IS_DONE
        }
    }

    /**
     * Метод получения статуса для присвоения в задачу на проверку по 123-ФЗ в зависимости от
     * атрибута, значений и значения атрибута rightcConcede
     * @param attributeCode - код атрибута
     * @param values - значения атрибута
     * @param rightcConcede - флаг, описывающий значение атрибута rightcConcede
     * @return статус для установки
     */
    private String getState(String attributeCode, Collection values, Boolean rightcConcede)
    {
        if(values*.get(AttributeCode.PROCESS_END).any { it == true })
        {
            return TaskState.FULL_CHECK
        }

        switch (attributeCode)
        {
            case AttributeCode.CHECK_STATUS: return TaskState.PROV_ST19
            case AttributeCode.CHECK_A19: return TaskState.CHECK_A15
            case AttributeCode.CHECK_A15: return TaskState.CHECK_PROPERTY
            case AttributeCode.CHECK_PROPERTY: return TaskState.CHECK_A16
            case AttributeCode.CHECK_A16: return rightcConcede ? TaskState.INPROGRESS : TaskState.CHECK_OTHERS
            case AttributeCode.CHECK_THIRD_A16: return TaskState.CHECK_OTHERS
            case AttributeCode.CHECK_OTHERS: return TaskState.PR_ST17
            case AttributeCode.CHECK_A17: return  rightcConcede ? TaskState.INPROGRESS : TaskState.CHECK_FIN_SERV
            case AttributeCode.CHECK_FIN_SERV:
                def value = values.find()
                if (value.code in [CheckFinServValues.VALUE_CORRECT, CheckFinServValues.NOT_ENOUGH_DATA])
                {
                    return TaskState.FULL_CHECK
                }
        }
    }

    /**
     * Метод установки статуса в задачу на проверку по 123-ФЗ
     * @param task - задача на проверку по 123-ФЗ
     * @param attributeCode - код атрибута
     * @param state - статус для установки
     */
    private void setTaskState(IUUIDIdentifiable task, String attributeCode, String state)
    {
        if (state)
        {
            utils.edit(task, [(AttributeCode.STATE) : state])
        }
    }

    /**
     * Метод установки значения по атрибуту в обращение
     * @param claim - обращение
     * @param attributeCode - код атрибута
     * @param values - значенния для установки по коду атрибута
     */
    private void setAttributeValues(IUUIDIdentifiable claim, String attributeCode, Collection<IUUIDIdentifiable> values)
    {
        utils.edit(claim, [(attributeCode): values])
    }

    /**
     * Метод добавления задачи по обращению, если пришло определенное значение в проверке финансовой услуги
     * @param claim - обращение
     * @param task - Задача на проверку по 123-ФЗ
     * @param value - значение проверки
     */
    private void createClaimTask(IUUIDIdentifiable claim, IUUIDIdentifiable task, def value)
    {
        if(value == CheckFinServValues.VALUE_ERROR)
        {
            utils.create(MetaClasses.TASK_EDITFU_METACLASS, [(AttributeCode.RESPONSIBLE): claim.get(AttributeCode.RESPONSIBLE),
                                                             (AttributeCode.STATE): TaskState.INPROGRESS,
                                                             (AttributeCode.SERVICE_CALL): claim,
                                                             (AttributeCode.TIME_TO_SOLVE): task.get(AttributeCode.TIME_TO_SOLVE),
                                                             (AttributeCode.TITLE): TaskTitles.EDITFU_TITLE
            ])
        }
        else if(value == CheckFinServValues.NOT_ENOUGH_DATA)
        {
            utils.create(MetaClasses.TASK_CHECK_CHANGES_METACLASS,
                         [(AttributeCode.RESPONSIBLE): utils.findFirst(MetaClasses.TEAM_METACLASS, [(AttributeCode.TITLE):TEAM_TITLE_TO_FIND]),
                          (AttributeCode.SERVICE_CALL): claim,
                          (AttributeCode.TIME_TO_SOLVE): types.newDateTimeInterval([3 as long, 'DAY' as String]),
                          (AttributeCode.TITLE): TaskTitles.CHECK_CHANGES_TITLE])
        }
    }
}