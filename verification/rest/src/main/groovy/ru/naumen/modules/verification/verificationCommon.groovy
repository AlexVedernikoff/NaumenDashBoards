//Автор: NordClan
//Дата создания: 07.10.2021
//Код: verification
//Назначение:
/**
 * Клиентский скриптовый модуль встроенного приложения "Verification".
 * Содержит классы для методов, описывающих проведение проверок обращения.
 */
//Версия SMP: 4.11.5

package ru.naumen.modules.verification

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import groovy.transform.Canonical
import groovy.transform.TupleConstructor

/**
 * Перечисление состояний проверок
 */
enum VerificationState
{
    NO_VERIFICATION,
    IN_VERIFICATION,
    VERIFICATION_FINISHED
}

/**
 * Тип списка
 */
enum ListType
{
    RADIO,
    CHECK
}

/**
 * Класс, описывающий метаклассы для работы
 */
class MetaClasses
{
    static final String TASK_METACLASS = 'task$checkTask'
    static final String TASK_EDITFU_METACLASS = 'task$editFUtask'
    static final String TASK_CHECK_CHANGES_METACLASS = 'task$checkChanges'
    static final String CLAIM_METACLASS = 'serviceCall$Claim'
    static final String TEAM_METACLASS = 'team'
}

/**
 * Класс, описывающий названия создаваемых задач
 */
class TaskTitles
{
    static final String EDITFU_TITLE = 'Изменение финансовой услуги'
    static final String CHECK_CHANGES_TITLE = 'Проверка значения финансовой услуги'
}

/**
 * Класс, описывающий сообщения пользователю в зависимости от статуса задачи
 */
class VerificationMessages
{
    static final String IF_TASK_STATE_REGISTERED = 'Необходимо взять обращение в работу'
    static final String IF_TASK_STATE_INPROGRESS = 'Проводится проверка оплаты 3 лиц'
    static final String IF_TASK_STATE_FULL_CHECK = 'Проводится проверка обращения'
    static final String NOT_AVAILABLE = 'Недоступно'
    static final String VERIFICATION_IS_DONE = 'Проверки пройдены'
}

/**
 * Состояния задачи
 */
class TaskState
{
    static final Collection<String> IN_VERIFICATION_STATES = [CHECK_STATUS, PROV_ST19, CHECK_A15, CHECK_PROPERTY,
                                                              CHECK_A16, CHECK_THIRD_A16, CHECK_OTHERS,
                                                              PR_ST17, CHECK_FIN_SERV].asImmutable()

    static final String CHECK_STATUS = 'checkStatus'
    static final String PROV_ST19 = 'provSt19'
    static final String CHECK_A15 = 'checkA15'
    static final String CHECK_PROPERTY = 'checkProperty'
    static final String CHECK_A16 = 'checkA16'
    static final String CHECK_THIRD_A16 = 'checkThirdA16'
    static final String CHECK_OTHERS = 'checkOthers'
    static final String PR_ST17 = 'prSt17'
    static final String CHECK_FIN_SERV = 'checkFinServ'
    static final String CLOSED = 'closed'

    static final String REGISTERED = 'registered'
    static final String INPROGRESS = 'inprogress'
    static final String FULL_CHECK = 'fullCheck'

}

/**
 * Код атрибута
 */
class AttributeCode
{
    static final Collection<String> VERIFICATION_ATTRIBUTE_CODES = [CHECK_STATUS, CHECK_A19,
                                                                    CHECK_A15, CHECK_PROPERTY,
                                                                    CHECK_A16, CHECK_THIRD_A16,
                                                                    CHECK_OTHERS, CHECK_A17,
                                                                    CHECK_FIN_SERV].asImmutable()

    static final Collection<String> CHECKBOX_ATTRIBUTE_CODES = [CHECK_STATUS, CHECK_A19,
                                                                CHECK_OTHERS, CHECK_A17].asImmutable()

    static final String CHECK_STATUS = 'checkStatus'
    static final String CHECK_A19 = 'checkA19'
    static final String CHECK_A15 = 'checkA15'
    static final String CHECK_PROPERTY = 'checkProperty'
    static final String CHECK_A16 = 'checkA16'
    static final String CHECK_THIRD_A16 = 'checkThirdA16'
    static final String CHECK_OTHERS = 'checkOthers'
    static final String CHECK_A17 = 'checkA17'
    static final String CHECK_FIN_SERV = 'checkFinServ'

    static final String PROCESS_END = 'processEnd'
    static final String TASKS = 'tasks'
    static final String RIGHTC_CONCEDE = 'rightcConcede'
    static final String STATE = 'state'

    static final String RESPONSIBLE = 'responsible'
    static final String SERVICE_CALL = 'serviceCall'
    static final String TIME_TO_SOLVE = 'timeToSolve'
    static final String TITLE = 'title'


}

/**
 * Класс, описывающий значения проверки финансовой услуги
 */
class CheckFinServValues
{
    static final String VALUE_CORRECT = 'valueCorrect'
    static final String VALUE_ERROR = 'valueError'
    static final String NOT_ENOUGH_DATA = 'notEnoughData'
}

/**
 * Стартовые настройки
 */
@Canonical
class StartSettings
{
    /**
     * Состояние проверок
     */
    VerificationState verificationState

    /**
     * Флаг на возможность
     */
    Boolean userIsAbleToVerify

    /**
     * Сообщение, если проверки не начаты
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String message

    /**
     * Проверенные данные
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    Collection<VerificationValue> verification
}

/**
 * Атрибут проверки
 */
class Attribute implements IHasTitle
{
    /**
     * Код атрибута
     */
    String code

    /**
     * Список значений атрибута
     */
    Collection<Value> values
    /**
     * Тип списка значений
     */
    ListType listType
}

/**
 * Класс, описывающий значения для выбора
 */
class Value implements IHasTitle
{
    /**
     * Уникальный идентификатор значения
     */
    @JsonProperty("UUID")
    String UUID

    /**
     * Код значения
     */
    String code
}

/**
 * Значение проверки
 */
class VerificationValue implements IHasTitle
{
    /**
     * Список значений по атрибуту
     */
    Collection<String> values
}

trait IHasTitle
{
    /**
     * Название атрибута
     */
    String title
}

/**
 * Запрос на установку значения и статуса задачи
 */
@Canonical
class SetValueAndTaskStateRequest
{
    /**
     * Код атрибута
     */
    String code

    /**
     * Уникальный идентификатор обращения
     */
    String claimUUID

    /**
     * Список значений
     */
    Collection<Value> values
}

/**
 * Базовый запрос на получение данных по настройкам/проверкам
 */
@Canonical
class BaseRequest
{
    /**
     * Уникальный идентификатор обращения
     */
    String claimUUID
}

/**
 * Запрос на получение стартовых настроек
 */
@Canonical
class GetStartSettingsRequest extends BaseRequest
{
    /**
     * Уникальный идентификатор обращения
     */
    String claimUUID
    /**
     * Текущий пользователь
     */
    def user
}

/**
 * Ответ на установку значения проверки и статуса задачи
 */
@Canonical
class SetValueAndTaskStateResponse
{
    /**
     * Флаг на то, что все проверки проведены
     */
    Boolean isFullChecked

    /**
     * Сообщение для пользователя
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    String message
}