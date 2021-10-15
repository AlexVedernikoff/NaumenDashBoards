/*! UTF-8 */
//Автор: nordclan
//Дата создания: 06.11.2019
//Код:
//Назначение:
/**
 * Бекенд для отправки email в встроенном приложении "Дашборды"
 */
//Версия: 4.10.0.15
//Категория: скриптовый модуль

package ru.naumen.modules.dashboards

import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.InheritConstructors

import javax.mail.util.ByteArrayDataSource
import ru.naumen.core.server.script.api.injection.InjectApi
import groovy.transform.Field
import static MessageProvider.*
import static CurrentUserHolder.*

@Field @Lazy @Delegate DashboardSendEmail dashboardSendEmail = new DashboardSendEmailImpl(binding)

/**
 * Интерфейс главного контроллера
 */
interface DashboardSendEmail
{
    /**
     * Метод отправки сообщений на почту
     * @param requestContent - тело запроса
     */
    Boolean sendFileToMail(Map<String, Object> requestContent)
}

@InheritConstructors
class DashboardSendEmailImpl extends BaseController implements DashboardSendEmail
{
    DashboardSendEmailService service = DashboardSendEmailService.instance

    Object run()
    {
        return null
    }

    @Override
    Boolean sendFileToMail(Map<String, Object> requestContent)
    {
        SendFileToEmailRequest request = new ObjectMapper().convertValue(requestContent, SendFileToEmailRequest)
        return service.sendFileToMail(request)
    }
}

@InjectApi
@Singleton
class DashboardSendEmailService
{
    MessageProvider messageProvider = MessageProvider.instance
    /**
     * Метод отправки сообщений на почту
     * @param request - запрос на отправку скрина с дашбордом по почте
     */
    Boolean sendFileToMail(SendFileToEmailRequest request)
    {
        String tokenKey = request.tokenKey
        String format = request.format
        String fileName = request.fileName
        List users = request.users
        users.each {user ->
            if (!user?.email)
            {
                String locale = DashboardUtils.getUserLocale(CurrentUserHolder.currentUser.get()?.UUID)
                String message = messageProvider.getConstant(USER_EMAIL_IS_NULL_OR_EMPTY_ERROR, locale)
                api.utils.throwReadableException("$message#${USER_EMAIL_IS_NULL_OR_EMPTY_ERROR}")
            }
            def file = beanFactory.getBean('uploadServiceImpl').get(tokenKey)
            def ds = new ByteArrayDataSource(file.inputStream, file.contentType)

            def message = api.mail.sender.createMail()
            message.addTo(user.title ?: api.metainfo.getMetaClass('employee').title, user.email)
            message.setSubject(fileName) //установка темы сообщения
            message.addText("${fileName}. Файл с изображением дашборда находится во вложении.") //установка текста сообщения
            message.attachFile(ds, "${fileName}.${format}")
            api.mail.sender.sendMail(message)
        }
        return true
    }
}

/**
 * Запрос на отправку скрина с дашбордом по почте
 */
class SendFileToEmailRequest
{
    /**
     *  Ключ на файл в хранилище
     */
    String tokenKey
    /**
     * Формат файла
     */
    String format
    /**
     * Название файла
     */
    String fileName
    /**
     * Список пользователей
     */
    List users
}