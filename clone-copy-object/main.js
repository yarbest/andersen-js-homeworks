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

console.log(obj1, obj2);
console.log(obj1.arr === obj2.arr); //false
console.log(obj1.arr[0] === obj2.arr[0]); //false
console.log(obj1.c === obj2.c); //false
console.log(obj1.c.d === obj2.c.d); //false
console.log(obj1.c.d.e === obj2.c.d.e); //false

//==================================================
