/**
 * @file Домашка по FP ч. 1
 * 
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    anyPass,
    allPass,
    propEq,
    filter,
    length,
    keys,
    gte,
    equals,
    not
} from 'ramda';

import { SHAPES, COLORS } from '../constants';

const countOfColor = (color, shapes) => {
    const isColor = n => equals(n, color);
    const countOfColor = length(keys(filter(isColor, shapes)));
    return countOfColor;
}

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shapes) => (
    allPass([
        propEq('star', 'red'),
        propEq('square', 'green'),
        propEq('triangle', 'white'),
        propEq('circle', 'white')
    ])(shapes)
);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shapes) => {
    const countOfGreen = countOfColor('green', shapes);
    return gte(countOfGreen, 2);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shapes) => {
    const countOfRed = countOfColor('red', shapes);
    const countOfBlue = countOfColor('blue', shapes);
    return equals(countOfRed, countOfBlue);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = (shapes) => (
    allPass([
        propEq('star', 'red'),
        propEq('square', 'orange'),
        propEq('circle', 'blue')
    ])(shapes)
);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shapes) => {
    const r = gte(countOfColor('red', shapes), 3);
    const b = gte(countOfColor('blue', shapes), 3);
    const o = gte(countOfColor('orange', shapes), 3);
    const g = gte(countOfColor('green', shapes), 3);

    return r || b || o || g;
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shapes) => {
    const twoGreen = shapes => equals(countOfColor('green', shapes), 2);
    const oneRed = shapes => equals(countOfColor('red', shapes), 1);

    return allPass([
        twoGreen,
        propEq('triangle', 'green'),
        oneRed
    ])(shapes)
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shapes) => equals(countOfColor('orange', shapes), 4);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shapes) => (
    not(anyPass([
        propEq('star', 'red'),
        propEq('star', 'white')
    ])(shapes))
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shapes) => equals(countOfColor('green', shapes), 4);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({square, triangle}) => {
    const notSimilar = () => not(equals(square, triangle));

    return not(anyPass([
        propEq('square', 'white'),
        propEq('triangle', 'white'),
        notSimilar
    ])({square, triangle}))
};
