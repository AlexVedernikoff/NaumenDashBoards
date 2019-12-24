/*! UTF-8 */
//Автор: nordclan
//Дата создания: 01.11.2019
//Код:
//Назначение:
/**
 * Модуль для вычислений формул
 */
//Версия: 6.10.0.15
//Категория: скриптовый модуль
package ru.naumen.modules

import groovy.json.JsonOutput

import java.util.regex.Pattern
import java.util.regex.Matcher
/**
 * обратная польская запись
 */
class FormulaCalculator
{
    static final private Pattern variableRegexp = ~/\{.+?\}/
    static final private Pattern numberRegexp = ~/-?\d+(?:\.?\d+|)/
    private String formula
    private Collection<String> ReversePolishNotation

    FormulaCalculator(String formula)
    {
        this.formula = formula
        this.ReversePolishNotation = createReversePolishNotation(formula)
    }

    /**
     * Метод получения списка всех переменных полученых из формулы
     * @return список имён переменных
     */
    Collection<String> getVariableNames()
    {
        ReversePolishNotation.findResults { it.matches(variableRegexp) ? it.replaceAll(~/[}{]/, ''): null }
    }

    /**
     * Метод вычисления формулы с массивом аргументов
     * @param calculateVariable - замыкание возвращающее массив значений по названию переменной
     * @return массив результатов вычисления
     */
    Collection<Double> multipleExecute(Closure<Collection<Double>> calculateVariable)
    {
        def variables = getVariableNames()

        if (variables) {
            Map<String, Iterator<Double>> iterators = variables.collectEntries { variable ->
                def values = calculateVariable(variable)
                [(variable): values.iterator()]
            }

            Collection<Map<String, Double>> listVariablesMap = []

            while (iterators.any { it.value.hasNext() }) {
                listVariablesMap << iterators.collectEntries { variable, iterator ->
                    [(variable): iterator.hasNext() ? iterator.next() : 0.0]
                }
            }

            return listVariablesMap.collect { mapVariables ->
                execute { variable ->
                    mapVariables.get(variable)
                }
            }
        } else {
            return [execute ()]
        }
    }

    /**
     * Метод вычисления обратоной польской нотации
     * @param calculateVariable - метод вычисления переменной
     * @return результат вычисления
     */
    double execute(Closure<Double> calculateVariable)
    {
        try {
            return  executeReversePolishNotation(ReversePolishNotation, calculateVariable)
        } catch(Exception ex) {
            throw new Exception(JsonOutput.toJson([error: "error execute formula: ${formula}", causes: ex.message]))
        }
    }

    /**
     * Метод вычисления формулы записанной в обратной польской нотации
     * @param rpn               - обратная польская нотация
     * @param calculateVariable - замыкание возвращающая значение по имени переменной
     * @return результат вычисления формулы
     */
    private double executeReversePolishNotation(Collection<String> rpn, Closure<Double> calculateVariable) {
        def stack = new Stack<Double>()
        rpn.each {
            switch(it) {
                case ~/^\{.*}$/ :
                    String variable = it.replaceAll(/[}{]/, '')
                    stack << calculateVariable.call(variable)
                    break
                case '+':
                    def val1 = stack.pop()
                    def val2 = stack.pop()
                    stack << (val2 + val1)
                    break
                case '-':
                    def val1 = stack.pop()
                    def val2 = stack.pop()
                    stack << (val2 - val1)
                    break
                case '/':
                    def val1 = stack.pop()
                    def val2 = stack.pop()
                    stack << (val2 / val1)
                    break
                case '*':
                    def val1 = stack.pop()
                    def val2 = stack.pop()
                    stack << (val2 * val1)
                    break
                default: stack << (it as Double); break
            }
        }
        return stack.pop()
    }

    /**
     * Метод преобразования формулы в обнатную польскую нотацию
     * Поддерживает только операции: сложения вычитания умножение деления и взятие в скобки
     * Переменные обрамляются фигурными скобками
     * @param formula - формула
     * @return формула в обратной польской нотации
     */
    private Collection<String> createReversePolishNotation(String formula)
    {
        Stack<String> stack = new Stack<>()
        Collection<String> res = []
        for(int i = 0; i < formula.length(); i++) {
            //обход по символьно
            switch(formula[i]) {
                case '(':
                    stack << formula[i]
                    break
                case ')':
                    String s
                    while(( s = stack.pop()) != '(') { res << s }
                    break
                case ['*', '/']:
                    //эти операции приорететнее
                    while (!stack.isEmpty() && stack.peek() in ['*', '/']) { res << stack.pop() }
                    stack << formula[i]
                    break
                case '-':
                    int prefIndex = i - 1
                    if(prefIndex >= 0 && !(formula[prefIndex] in ['(', '*', '/', '+', '-'])) {
                        //бинарный оператор
                        while (!stack.isEmpty() && stack.peek() in ['*', '/', '+', '-']) { res << stack.pop() }
                        stack << formula[i]
                    } else {
                        //унарный оператор
                        def number = extractNumber(formula.substring(i) as String)
                        res << number
                        i += number.size() - 1
                    }
                    break
                case '+':
                    //извлекаем операции умножения и деления
                    //стек может быть пустым
                    while (!stack.isEmpty() && stack.peek() in ['*', '/', '+', '-']) { res << stack.pop() }
                    stack << formula[i]
                    break
                default:
                    int size
                    if (formula[i] == '{') { // извлечение переменной
                        def variable = extractVariable(formula.substring(i))
                        res << variable
                        i += variable.size() - 1
                    } else if(formula[i].isNumber()) { //извлечение числа
                        def number = extractNumber(formula.substring(i))
                        res << number
                        i += number.size() - 1
                    }
                    break
            }
        }
        while(!stack.isEmpty()) {res << stack.pop()}
        stack.clear()
        res
    }

    /**
     * Метод поиска и извлечения числа из строки
     * @param str - строка в которой ведётся поиск числа
     * @return строку содержащее число
     */
    private String extractNumber(String str) {
        Matcher matcher = numberRegexp.matcher(str)
        if (matcher.find()) {
            return matcher.group(0)
        } else {
            throw new Exception("Number not found in current string")
        }
    }

    /**
     * Метод поиска и извлечения переменной из строки
     * @param str - строка в которой ведётся поиск переменной
     * @return строку содержащее переменную
     */
    private String extractVariable(String str) {
        Matcher matcher = variableRegexp.matcher(str)
        if(matcher.find()) {
            return matcher.group(0)
        } else {
            throw new Exception("Variable not found in current string")
        }
    }
}
return