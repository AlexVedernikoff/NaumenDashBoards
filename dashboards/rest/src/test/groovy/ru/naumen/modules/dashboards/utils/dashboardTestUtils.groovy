package ru.naumen.modules.dashboards.utils

import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.invocation.InvocationOnMock
import ru.naumen.core.server.script.api.*
import ru.naumen.core.server.script.api.ea.IEmbeddedApplicationsApi
import ru.naumen.core.server.script.api.metainfo.IMetaClassWrapper
import ru.naumen.core.server.script.spi.IScriptConditionsApi
import ru.naumen.core.server.script.spi.IScriptUtils
import ru.naumen.core.shared.dto.ISDtObject
import ru.naumen.modules.dashboards.DashboardQueryWrapperUtils
import ru.naumen.modules.dashboards.DashboardUtils

import static org.mockito.ArgumentMatchers.any

/**
 * Класс, описывающий основные моки для сервисов. Обладает функционалом регистрации объектов для тестов.
 */
abstract class ApiDependedUnitTest
{
    @Mock
    protected final IMetainfoApi metainfo
    @Mock
    protected final IScriptUtils utils
    @Mock
    protected final IKeyValueStorageApi keyValue
    @Mock
    protected final IListDataApi listdata
    @Mock
    protected final IWebApi web
    @Mock
    protected final IEmbeddedApplicationsApi apps
    @Mock
    protected final IDbApi db
    @Mock
    protected final DashboardUtils dashboardUtils
    @Mock
    protected final IScriptConditionsApi op
    @Mock
    protected final ISearchParams sp
    @Mock
    protected final ITypesApi types
    @Mock
    protected final ISelectClauseApi selectClause
    @Mock
    protected final IAuthenticationApi auth
    @Mock
    protected final DashboardQueryWrapperUtils dashboardQueryWrapperUtils

    static Map<String,Object> objects = [:]

    /**
     * Метод для регистрации объекта
     * @param object - объект в виде мапы
     */
    void registerObject(Map<String, Object> object)
    {
        String UUID = object.UUID as String
        if (UUID)
        {
            objects.put(UUID, object.withTraits(ISDtObject))
        }
    }

    /**
     * Метод для регистрации метакласса
     * @param clazz - метакласс в виде мапы
     */
    void registerMetaClass(Map<String, Object> clazz)
    {
        String code = clazz.code as String
        if(code)
        {
            objects.put(code, clazz.withTraits(IMetaClassWrapper))
        }
    }

    /**
     * Метод для установки моков по зарегистированным объектам
     */
    @BeforeEach
    void mockForObjects()
    {
        Mockito.lenient().when(utils.get(any())).thenAnswer { InvocationOnMock invocation ->
            return objects[invocation.getArgument(0) as String]
        }

        Mockito.lenient().when(metainfo.getMetaClass(any())).thenAnswer { InvocationOnMock invocation ->
            return objects[invocation.getArgument(0) as String]

        }
    }

    /**
     * Метод очистки списка объектов
     */
    @AfterEach
    void clearObjects()
    {
        objects.clear()
    }
}

