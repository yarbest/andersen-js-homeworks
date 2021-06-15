(function () {
    function cloneObject(originObj) {
        if (!originObj || typeof originObj !== 'object') return originObj; //если текущее значение примитив или null, тогда его сразу возвращаем

        let result;
        //если не сделать эту проверку, тогда массивы из оригинала, будут превращены в объекты ( {0: value1, 1: value2} )
        if (Array.isArray(originObj)) result = [];
        else result = {};

        // ключи массива === его индексы, поэтому используем Object.keys
        Object.keys(originObj).forEach((key) => {
            result[key] = cloneObject(originObj[key]);
        });
        return result;
    }

    const obj1 = {
        arr: [[1], 2],
        c: { d: { e: [1] } },
    };
    const obj2 = cloneObject(obj1);

    console.group('clone object');

    console.log('obj1', obj1);
    console.log('obj2', obj2);
    console.log(obj1.arr === obj2.arr); //false
    console.log(obj1.arr[0] === obj2.arr[0]); //false
    console.log(obj1.c === obj2.c); //false
    console.log(obj1.c.d === obj2.c.d); //false
    console.log(obj1.c.d.e === obj2.c.d.e); //false

    console.groupEnd('clone object');
})();

//==================================================

(function () {
    function checkEqual(object1, object2) {
        if ((!object1 || typeof object1 !== 'object') && object1 !== object2) return false; //если параметры примитивы и они не равны, то сразу выходим
        //при первом встреченном неравенстве, возвращается false, и every завершается

        if (Object.keys(object1).length !== Object.keys(object2).length) return false; //если у двух объектов разное кол-во ключей, тогда они не равны

        //когда в object1 попадает примитив, то every возвращает true, так как
        //Object.keys(1) возвращает пустой массив, а every от пустого массива возвращает true
        //в других случаях срабатывает проверка и рекурсивный вызов функции
        return Object.keys(object1).every((key) => {
            //если в object2 есть такой же ключ, что и в object1, тогда можно продолжить
            if (key in object2) return checkEqual(object1[key], object2[key]);
            //иначе вернется undefined и every сразу завершится
        });
    }
    const obj1 = {
        a: 1,
        b: { c: 2 },
        c: [3, { d: 4 }],
    };

    const obj2 = {
        a: 1,
        b: { c: 2 },
        c: [3, { d: 4 }],
    };
    console.group('equal object');

    console.log('obj1', obj1);
    console.log('obj2', obj2);
    console.log('obj1 === obj2', obj1 === obj2); //false
    console.log('obj1 equal obj2', checkEqual(obj1, obj2)); //true
    console.log(obj1.a === obj2.a); // true primitive
    console.log(obj1.b === obj2.b); //false
    console.log(obj1.b.c === obj2.b.c); //true primitive
    console.log(obj1.c === obj2.c); //false
    console.log(obj1.c[1] === obj2.c[1]); //false

    console.groupEnd('equal object');
})();
