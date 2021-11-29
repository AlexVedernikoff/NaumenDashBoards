package ru.naumen.modules.dashboards

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Spy
import org.mockito.junit.jupiter.MockitoExtension
import ru.naumen.core.server.script.api.metainfo.IAttributeTypeWrapper
import ru.naumen.core.server.script.api.metainfo.IMetaClassWrapper
import ru.naumen.metainfo.shared.IClassFqn
import ru.naumen.modules.dashboards.utils.ApiDependedUnitTest

import static org.mockito.ArgumentMatchers.any
import static org.mockito.ArgumentMatchers.eq
import static org.mockito.Mockito.doReturn
import static org.mockito.Mockito.when

/**
 * <p>Тестирование методов модуля Dashboards.</p>
 *
 * <p><b>Ссылки на задачи:</b></p>
 *
 * <ol>
 *     <li>
 *         <a href="https://naupp.naumen.ru/sd/operator/#uuid:projectTasks$140161710" target="_blank">
 *            SMRMEXT-12792 АТ: разработка юнит тестов на бэк
 *         </a>
 *    </li>
 * </ol>
 *
 *<p><b>Подготовка:</b></p>
 *
 * <ol>
 *     <li>при работе метода metainfo.getMetaClass будет возвращен заранее подготовленный результат - описанный в тесте метакласс;</li>
 *     <li>при работе метода validateClazz будет возвращен результат true или false, в зависимости от потребностей теста;</li>
 *     <li>при работе метода formatGroupSet будет возвращать заранее подготовленный результат в случае, если в пришедшем датасете есть данные по статусам.</li>
 * </ol>
 *
 * <p><b>Действия и проверки:</b></p>
 *
 * <ol>
 *     <li>whenAllDataSourcesNotRemovedThenReturnSourceList - метод getDataSources - проверка возврата всех не архивных источников;</li>
 *     <li>whenSomeDataSourcesNotRemovedThenReturnNotRemovedSourceList - метод getDataSources - проверка возврата только не архивных источников;</li>
 *     <li>whenNoDataSourcesThenReturnEmptyList - метод getDataSources - проверка возврата пустого списка, если источники не нашлись;</li>
 *     <li>whenNoParentClassFqnReturnAttributesByClassFqn - метод getDataSourceAttributes -
 *     проверка возврата ожидаемого списка атрибутов только типов, предопределнных для работы, по основному коду источника;</li> *
 *     <li>whenParentClassFqnThenReturnAttributesByAttributeClassInParentClassFqn - метод getDataSourceAttributes -
 *     проверка возврата ожидаемого списка атрибутов только типов, предопределнных для работы, по коду источника, получаемого из атрибута по классу, определенному в ParentClassFqn;</li> *
 *     <li>whenTypesAreSpecialThenReturnAttributesByClassFqnAndTypes - метод getDataSourceAttributes - проверка возврата ожидаемого списка атрибутов только типов, предопределнных в запросе;</li> *
 *     <li>whenAttributesListHasTimerTypeThenReturnDoubleTimerAttributesWithDifferentTimerValue - метод getDataSourceAttributes -
 *     проверка возврата ожидаемого списка атрибутов c двойной отправкой атрибута типа счетчик.</li> *
 * </ol>
 */

@ExtendWith(MockitoExtension)
class DashboardsTest extends ApiDependedUnitTest
{
    @Spy
    @InjectMocks
    private DashboardsService service

    private static final String MAIN_FQN = 'abstractBO'
    private static final String LC_PARENT_FQN = 'abstractSysObj'
    private static final String LC_FQN = 'abstractEvt'

    /**
     * проверка возврата всех не архивных источников
     */
    @Test
    void whenAllDataSourcesNotRemovedThenReturnSourceList()
    {
        List classChildren = [ [title: 'test2', code: 'testMetaClass2' ].withTraits(IMetaClassWrapper),
                               [title: 'test3', code: 'testMetaClass3' ].withTraits(IMetaClassWrapper)]

        Collection<IMetaClassWrapper> metaClasses = []

        metaClasses << [title: 'test', code: 'testMetaClass', children: classChildren].withTraits(IMetaClassWrapper)
        metaClasses << [title: 'testNew', code: 'testMetaClassNew1'].withTraits(IMetaClassWrapper)
        metaClasses << [title: 'testNew1', code: 'testMetaClassNew2'].withTraits(IMetaClassWrapper)

        def mainMetaClass = [title: 'main', code: MAIN_FQN, children: metaClasses]
        registerMetaClass(mainMetaClass)

        doReturn(true).when(service).validateClazz(any())
        List actual = service.getDataSources()

        assert actual*.classFqn == metaClasses*.code
        assert actual[0].children.classFqn == classChildren.code
    }

    /**
     * проверка возврата только не архивных источников
     */
    @Test
    void whenSomeDataSourcesNotRemovedThenReturnNotRemovedSourceList()
    {
        List classChildren = [ [title: 'test2', code: 'testMetaClass2' ].withTraits(IMetaClassWrapper),
                               [title: 'test3', code: 'testMetaClass3' ].withTraits(IMetaClassWrapper)]
        Collection<IMetaClassWrapper> metaClasses = []

        metaClasses << [title: 'test', code: 'testMetaClass', children: classChildren].withTraits(IMetaClassWrapper)
        metaClasses << [title: 'testNew', code: 'testMetaClassNew1'].withTraits(IMetaClassWrapper)
        metaClasses << [title: 'testNew1', code: 'testMetaClassNew2'].withTraits(IMetaClassWrapper)

        def mainMetaClass = [title: 'main', code: MAIN_FQN, children: metaClasses]
        registerMetaClass(mainMetaClass)

        def zeroMetaClass = [:].withTraits(IMetaClassWrapper)
        when(service.metainfo.getMetaClass(eq(LC_PARENT_FQN))).thenReturn(zeroMetaClass)

        doReturn(true).when(service).validateClazz(eq(metaClasses[0]))
        doReturn(true).when(service).validateClazz(eq(metaClasses[1]))
        doReturn(false).when(service).validateClazz(eq(metaClasses[2]))

        List actual = service.getDataSources()

        assert actual*.classFqn == metaClasses[0..-2].code
        assert actual[0].children.classFqn == classChildren.code
    }

    /**
     * проверка возврата пустого списка, если источники не нашлись
     */
    @Test
    void whenNoDataSourcesThenReturnEmptyList()
    {
        def zeroMetaClass = [:].withTraits(IMetaClassWrapper)
        when(service.metainfo.getMetaClass(any())).thenReturn(zeroMetaClass)
        List actual = service.getDataSources()
        assert actual == []
    }

    /**
     * проверка возврата ожидаемого списка атрибутов только типов, предопределнных для работы, по основному коду источника
     */
    @Test
    void whenNoParentClassFqnReturnAttributesByClassFqn()
    {
        List classChildren = [ [title: 'test2', code: 'testMetaClass2' ].withTraits(IMetaClassWrapper),
                               [title: 'test3', code: 'testMetaClass3' ].withTraits(IMetaClassWrapper)]

        def clazz = [title: 'test', code: 'testMetaClass', children: classChildren, attributes: []]

        Collection attributes = []

        def attributeTypeCase = [isCase: false, isClass: true, id: 'testMetaClass', code: 'testMetaClass', allowed: true].withTraits(IClassFqn)
        attributes << [code             : 'str',
                       title            : 'string attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'string', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int',
                       title            : 'integer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'double',
                       title            : 'double attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'double', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)
        attributes << [code             : 'timer',
                       title            : 'timer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'timer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int1',
                       title            : 'integer1 attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer1', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        clazz.attributes = attributes
        clazz.put( 'getAttribute', { String code ->attributes.find { it?.code == code } })
        registerMetaClass(clazz)

        Collection actualAttrs = service.getDataSourceAttributes('testMetaClass', '', [])
        assert (actualAttrs*.code - attributes[0..-2]*.code) == []
    }

    /**
     * проверка возврата ожидаемого списка атрибутов только типов, предопределнных для работы, по коду источника, получаемого из атрибута по классу, определенному в ParentClassFqn
     */
    @Test
    void whenParentClassFqnThenReturnAttributesByAttributeClassInParentClassFqn()
    {
        List classChildren = [ [title: 'test2', code: 'testMetaClass2' ].withTraits(IMetaClassWrapper),
                               [title: 'test3', code: 'testMetaClass3' ].withTraits(IMetaClassWrapper)]

        def clazz = [title: 'test', code: 'testMetaClass', children: classChildren, attributes: []]

        Collection attributes = []

        def attributeTypeCase = [isCase: false, isClass: true, id: 'testMetaClass', code: 'testMetaClass', allowed: true].withTraits(IClassFqn)
        attributes << [code             : 'str',
                       title            : 'string attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'string', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int',
                       title            : 'integer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'double',
                       title            : 'double attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'double', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)
        attributes << [code             : 'timer',
                       title            : 'timer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'timer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int1',
                       title            : 'integer1 attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer1', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        clazz.attributes = attributes
        clazz.put( 'getAttribute', { String code ->attributes.find { it?.code == code } })
        registerMetaClass(clazz)
        when(service.metainfo.getMetaClass(any())).thenReturn(clazz.withTraits(IMetaClassWrapper))
        Collection actualAttrs = service.getDataSourceAttributes('str', 'testMetaClass1', [])
        assert (actualAttrs*.code - attributes[0..-2]*.code) == []
    }

    /**
     * проверка возврата ожидаемого списка атрибутов только типов, предопределнных в запросе
     */
    @Test
    void whenTypesAreSpecialThenReturnAttributesByClassFqnAndTypes()
    {
        List classChildren = [ [title: 'test2', code: 'testMetaClass2' ].withTraits(IMetaClassWrapper),
                               [title: 'test3', code: 'testMetaClass3' ].withTraits(IMetaClassWrapper)]

        def clazz = [title: 'test', code: 'testMetaClass', children: classChildren, attributes: []]

        Collection attributes = []

        def attributeTypeCase = [isCase: false, isClass: true, id: 'testMetaClass', code: 'testMetaClass', allowed: true].withTraits(IClassFqn)
        attributes << [code             : 'str',
                       title            : 'string attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'string', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int',
                       title            : 'integer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'double',
                       title            : 'double attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'double', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)
        attributes << [code             : 'timer',
                       title            : 'timer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'timer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int1',
                       title            : 'integer1 attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer1', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        clazz.attributes = attributes
        clazz.put( 'getAttribute', { String code ->attributes.find { it?.code == code } })
        registerMetaClass(clazz)
        when(service.metainfo.getMetaClass(any())).thenReturn(clazz.withTraits(IMetaClassWrapper))
        Collection actualAttrs = service.getDataSourceAttributes('str', '', ['integer'])

        assert actualAttrs*.code == [attributes[1].code]
    }

    /**
     * проверка возврата ожидаемого списка атрибутов c двойной отправкой атрибута типа счетчик
     */
    @Test
    void whenAttributesListHasTimerTypeThenReturnDoubleTimerAttributesWithDifferentTimerValue()
    {
        List classChildren = [ [title: 'test2', code: 'testMetaClass2' ].withTraits(IMetaClassWrapper),
                               [title: 'test3', code: 'testMetaClass3' ].withTraits(IMetaClassWrapper)]

        def clazz = [title: 'test', code: 'testMetaClass', children: classChildren, attributes: []]

        Collection attributes = []

        def attributeTypeCase = [isCase: false, isClass: true, id: 'testMetaClass', code: 'testMetaClass', allowed: true].withTraits(IClassFqn)
        attributes << [code             : 'str',
                       title            : 'string attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'string', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int',
                       title            : 'integer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'double',
                       title            : 'double attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'double', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)
        attributes << [code             : 'timer',
                       title            : 'timer attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'timer', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        attributes << [code             : 'int1',
                       title            : 'integer1 attr',
                       declaredMetaClass: clazz,
                       metaClass        : clazz,
                       type             : [code: 'integer1', relatedMetaClass: attributeTypeCase].withTraits(IAttributeTypeWrapper)
        ].withTraits(ru.naumen.core.server.script.api.metainfo.IAttributeWrapper)

        clazz.attributes = attributes
        clazz.put( 'getAttribute', { String code ->attributes.find { it?.code == code } })
        registerMetaClass(clazz)
        when(service.metainfo.getMetaClass(any())).thenReturn(clazz.withTraits(IMetaClassWrapper))
        Collection actualAttrs = service.getDataSourceAttributes('str', '', [])

        assert ((actualAttrs*.code as Set) - attributes[0..-2]*.code).toList() == []
        assert actualAttrs.findAll {it.type == 'timer' }.size() == 2
    }
}