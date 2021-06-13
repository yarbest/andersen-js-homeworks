(function () {
    function cloneObject(originObj) {
        if (!originObj || typeof originObj !== 'object') return originObj;

        let result;
        if (Array.isArray(originObj)) result = [];
        else result = {};

        // ключи массива === его индексы
        Object.keys(originObj).forEach((key) => {
            if (key in originObj) result[key] = cloneObject(originObj[key]);
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
        let flag;
        if ((!object1 || typeof object1 !== 'object') && object1 !== object2) return false;

        //первое несходство возвращает false
        return Object.keys(object1).every((key) => {
            if (key in object2) return checkEqual(object1[key], object2[key]);
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
