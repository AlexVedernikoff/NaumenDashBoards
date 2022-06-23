//Авторы: rmartynov, vmikolyuk
//Дата создания: 10.12.2021
//Назначение: предоставляет ВП от nordclan получать информацию о результатах проверки решения
//Версия: 4.11.5.18

import static groovy.json.JsonOutput.toJson

/**
 * Получение информации о проверке решения
 * @param decisionUUID UUID решения
 * @return возвращает последнюю проверку в документе (по дате создания)
 */
def getVerifyResult(def decisionUUID)
{
    def decision = utils.get(decisionUUID)
    def lastCheckSolution = decision.checkSolutio.toList().sort {it.creationDate.getTime()}.last()

    if (lastCheckSolution)
    {
        return toJson(
            ["message" : "checkFinished",
             "document": lastCheckSolution.fileHTML.first().getUUID(),
             "entities": lastCheckSolution.extractedEnt.collect {
                 ["title"      : it.title,
                  "state"      : it.status.code,
                  "valueAdvice": it.valueAdvice,
                  "valueDoc"   : it.valueDoc,
                  "position"   : it.position,
                  "UUID"       : it.revisionUUID]
             }.sort {o1, o2 -> stateComparator(o1.state, o2.state)}]
        )
    }
    else
    {
        return toJson(["message": "checkInProgress"])
    }
}

/**
 * Изменяет статус сущности контекста. Возможные переходы:
 * error -> fixed, skipped; skipped -> error; fixed -> error.
 * @param revisionUUID идентификатор ревизии
 * @param status статус
 * @return результат выполнения действия изменения статуса
 */
def editEntityState(def revisionUUID, def status)
{
    def entities = utils.find('extractedEnti$context', [revisionUUID: revisionUUID])
    if (entities?.size() == 1)
    {
        def entity = entities.first()
        if (isValidStatusChange(entity.status?.code, status))
        {
            def statusObj = utils.find('catalogs$statusEnti', [code: status])
            if (statusObj)
            {
                utils.edit(entity, [status: statusObj])
                return toJson([result: true])
            }
        }
    }
    return toJson([result: false])
}

/**
 * Сформировать выходной документ
 * @param documentUUID идентификатор документа-основания
 * @return результат выполнения действия формирования документа
 */
def createExitDocument(def documentUUID)
{
    def document = utils.get(documentUUID)
    def checkSolution = utils.get(document.source)
    def extractedEntities = checkSolution.extractedEnt

    // проверка, все ли сущности были обработаны
    if (extractedEntities.every {it.status?.code in ['equally', 'fixed', 'skipped']})
    {
        def info = extractedEntities.collect {
            [revisionUUID: it.revisionUUID,
             accept      : it.status?.code in ['equally', 'fixed']]
        }
        def result = modules.IntelligentSolutionUtils.createExitDocument(checkSolution, info)
        return toJson([result: result])
    }
    return toJson([result: false])
}

def static isValidStatusChange(def oldState, def newState)
{
    return oldState == 'error' && newState in ['fixed', 'skipped'] ||
        oldState in ['fixed', 'skipped'] && newState == 'error'

}

def static stateComparator(o1, o2)
{
    return o1 == 'error' && o2 != 'error' ? -1 : (o1 != 'error' && o2 == 'error' ? 1 : 0)
}
