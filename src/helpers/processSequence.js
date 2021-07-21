/**
 * @file Домашка по FP ч. 2
 * 
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 * 
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 * 
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
*/
import Api from '../tools/api';
import {
    pipe,
    tap,
    allPass,
    length,
    gt,
    lt,
    test,
    ifElse,
    mathMod,
    andThen,
    prop,
    otherwise,
    __
} from 'ramda';

const api = new Api();

const greaterThanTwo = value => gt(length(String(value)), 2);
const lessThanTen = value => lt(length(String(value)), 10);
const moreThanZero = value => gt(value, 0);
const isNumber = value => test(/^\d+\.?\d+$/, value);

const validate = allPass([
    greaterThanTwo,
    lessThanTen,
    moreThanZero,
    isNumber
]);

const convertToBinary = value => api.get('https://api.tech/numbers/base')({from: 10, to: 2, number: value});
const fetchAnimal = id => api.get(`https://animals.tech/${id}`)({});

const pow = value => Math.pow(value, 2);
 
const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
    pipe(
        // 1. Берем строку N. Пишем изначальную строку в writeLog.
        tap(writeLog),
        ifElse(
            // 2. Строка валидируется по следующим правилам
            validate, 

            pipe(
                // 3. Привести строку к числу, округлить к ближайшему целому с точностью до единицы, записать в writeLog.
                Number,
                Math.round,
                tap(writeLog),

                // 4. C помощью API /numbers/base перевести из 10-й системы счисления в двоичную, результат записать в writeLog
                convertToBinary,
                andThen( 
                    pipe(
                        prop('result'),
                        tap(writeLog),

                        // 5. Взять кол-во символов в полученном от API числе записать в writeLog
                        String,
                        length,
                        tap(writeLog),

                        // 6. Возвести в квадрат с помощью Javascript записать в writeLog
                        pow,
                        tap(writeLog),

                        // 7. Взять остаток от деления на 3, записать в writeLog
                        mathMod(__, 3),
                        tap(writeLog),

                        // 8. C помощью API /animals.tech/id/name получить случайное животное используя полученный остаток в качестве id
                        fetchAnimal,
                        andThen(
                            pipe(
                                prop('result'),

                                // 9. Завершить цепочку вызовом handleSuccess в который в качестве аргумента положить результат полученный на предыдущем шаге
                                tap(handleSuccess)
                            )
                        ),
                        otherwise(tap(handleError))
                    )
                ),
                otherwise(tap(handleError))
            ),

            // В случае ошибки валидации вызвать handleError с 'ValidationError' строкой в качестве аргумента
            () => handleError('validationError')
        )
    )(value);
}
 
export default processSequence;
