import templateTimer from './template-timer.js';

const mainWrapper = document.querySelector('.main-wrapper');

const updateStorage = () => {
    localStorage.setItem(
        'timers',
        JSON.stringify(
            Timer.timersArray.map((obj) => {
                return {
                    timerInnerHTML: obj.timerHTMLElem.innerHTML,
                    timerInfo: obj.timerInfo,
                };
            })
        )
    );
};

class Timer {
    static timersArray = []; //по этому массиву буду искать нужный таймер, тут будут храниться экземпляры класса
    static addTimerToStaticArray(newObject) {
        this.timersArray.push(newObject);
    }
    static removeTimerFromStaticArray(timerId) {
        this.timersArray.splice(
            this.timersArray.findIndex((timer) => timer.timerInfo.timerId === +timerId),
            1
        );
    }
    //этот метод нужен для того, чтобы айдишники таймеров не дублировались, когда будем удалять и добавлять новые
    static findMaxTimerId() {
        if (this.timersArray.length === 0) return 0; //если таймеров еще нет, тогда нумерация айдишников начинается с начала

        //сортируем массив таймеров, по возрастанию их айдишников
        this.timersArray.sort((a, b) => {
            if (a.timerInfo.timerId < b.timerInfo.timerId) return -1;
            else if (a.timerInfo.timerId > b.timerInfo.timerId) return 1;
            else return 0;
        });
        console.log(this.timersArray);
        return this.timersArray[this.timersArray.length - 1].timerInfo.timerId; //возвращаем максимальный айди
    }

    constructor(timerId, timerInfoFromStorage) {
        //Если в хранилище есть таймеры
        if (timerInfoFromStorage) {
            // в timerInfoFromStorage есть 2 свойства, timerInnerHTML с html кодом целого таймера и timerInfo - информация из экземпляра класса
            this.timerInfo = {
                timerId,
                isTimerWorking: timerInfoFromStorage.timerInfo.isTimerWorking,
                isTimerNull: timerInfoFromStorage.timerInfo.isTimerNull,
                timerLaps: timerInfoFromStorage.timerInfo.timerLaps,
                passedTime: timerInfoFromStorage.timerInfo.passedTime,
            };

            this.timerHTMLElem = this.createTimer(timerInfoFromStorage.timerInnerHTML);
            this.millisecondsHTMLElem = this.timerHTMLElem.querySelector('.timer-milliseconds');
            this.secondsHTMLElem = this.timerHTMLElem.querySelector('.timer-seconds');
            this.minutesHTMLElem = this.timerHTMLElem.querySelector('.timer-minutes');
            this.hoursHTMLElem = this.timerHTMLElem.querySelector('.timer-hours');

            Timer.addTimerToStaticArray(this);

            if (this.timerInfo.isTimerWorking && !this.timerInfo.isTimerNull) {
                this.startTimer(this.timerInfo.timerId, true);
            }
            return; //нужно после этого выйти из конструктора, иначе будут дубликаты таймеров
        }

        this.timerInfo = {
            timerId,
            isTimerWorking: false,
            isTimerNull: true,
            timerLaps: 0,
            passedTime: 0,
        };
        this.timerHTMLElem = this.createTimer(); // кладем ссылку на html блок в свойство объекта
        this.millisecondsHTMLElem = this.timerHTMLElem.querySelector('.timer-milliseconds');
        this.secondsHTMLElem = this.timerHTMLElem.querySelector('.timer-seconds');
        this.minutesHTMLElem = this.timerHTMLElem.querySelector('.timer-minutes');
        this.hoursHTMLElem = this.timerHTMLElem.querySelector('.timer-hours');

        Timer.addTimerToStaticArray(this);
    }

    createTimer(innerHTMLFromStorage) {
        const newTimer = document.createElement('div');
        newTimer.classList.add('timer-wrapper');
        newTimer.dataset.timerId = this.timerInfo.timerId; //даем айдишник таймеру

        //Если в хранилище были таймеры, то новые таймеры нужно создать на их основе, иначе на основе шаблона
        if (innerHTMLFromStorage) {
            newTimer.innerHTML = innerHTMLFromStorage;
        } else newTimer.innerHTML = templateTimer; //создаем новый таймер, на основе шаблона из другого файла

        newTimer.querySelector('.btn-controls-block').addEventListener('click', (event) => {
            const target = event.target;
            const parent = target.closest('[data-timer-id]');
            if (target.matches('.btn-start') && !this.timerInfo.isTimerWorking && this.timerInfo.isTimerNull) {
                this.startTimer(parent.dataset.timerId);
                //в зависимости от нажатой кнопки, поднимаемся к ее родителю, у которого есть дата атрибут-айди
                //этот айди таймера поможет определить, какой таймер запускать, останавливать и т.д.
            } else if (target.matches('.btn-start') && !this.timerInfo.isTimerWorking && !this.timerInfo.isTimerNull) {
                this.continueTimer(parent.dataset.timerId);
            } else if (target.matches('.btn-stop') && this.timerInfo.isTimerWorking) {
                this.stopTimer(parent.dataset.timerId);
            } else if (target.matches('.btn-round') && this.timerInfo.isTimerWorking) {
                this.makeNewRound(parent.dataset.timerId);
            } else if (target.matches('.btn-reset')) {
                this.resetTimer(parent.dataset.timerId);
            } else if (target.matches('.btn-delete')) {
                this.deleteTimer(parent.dataset.timerId);
            }
        });

        mainWrapper.append(newTimer);

        return newTimer;
    }

    findNeededTimerById(timerId) {
        return Timer.timersArray.find((timer) => {
            return timer.timerInfo.timerId === +timerId;
        });
    }

    startTimer(timerId, neededToContinue) {
        const currentObject = this.findNeededTimerById(timerId);
        //currentObject - это объект класса Timer, для которого были использованы кнопки старта, остановки и т.д.
        //получение этого объекта осуществляется в специальном статическом массиве, основываясь, на айдишнике таймера, для которого вызвали какое-то действие

        let start;
        if (neededToContinue) start = Date.now() - this.timerInfo.passedTime;
        else start = Date.now();

        this.timerInfo.isTimerWorking = true;
        this.timerInfo.isTimerNull = false;

        const changeTime = () => {
            // updateStorage(); рань ше хранилище обновлялось постоянно, чтобы при обновлении страницы сохранять актуальное время, но событие unload решило это
            if (!this.timerInfo.isTimerWorking) return; //это свойство, которое может стать false и остановить анимацию, если нажмем на кнопку stop
            const current = Date.now();
            this.timerInfo.passedTime = current - start;

            const checkIfOneDigit = (field, time) => {
                if (field.matches('.timer-milliseconds')) {
                    if (time.toString().length === 2) field.textContent = '0' + time;
                    else if (time.toString().length === 1) field.textContent = '00' + time;
                    else field.textContent = time;
                } else {
                    if (time.toString().length === 1) field.textContent = '0' + time;
                    else field.textContent = time;
                }
            };

            checkIfOneDigit(currentObject.millisecondsHTMLElem, (current - start) % 1000); //% 1000 - чтобы показывало только 3 цифры
            checkIfOneDigit(currentObject.secondsHTMLElem, Math.floor((current - start) / 1000) % 60); //если не написать %, то после 60 секунд, значения для секунд не обнулятся
            checkIfOneDigit(currentObject.minutesHTMLElem, Math.floor((current - start) / 1000 / 60) % 60);
            checkIfOneDigit(currentObject.hoursHTMLElem, Math.floor((current - start) / 1000 / 60 / 60) % 24);

            requestAnimationFrame(changeTime);
        };

        requestAnimationFrame(changeTime);
    }

    stopTimer(timerId) {
        const currentObject = this.findNeededTimerById(timerId);
        currentObject.timerInfo.isTimerWorking = false;
    }

    continueTimer(timerId) {
        this.startTimer(timerId, true);
    }

    makeNewRound(timerId) {
        const currentObject = this.findNeededTimerById(timerId);

        currentObject.timerHTMLElem.querySelector('tbody').insertAdjacentHTML(
            'afterbegin',
            `<td>${++currentObject.timerInfo.timerLaps}</td>
            <td>${currentObject.hoursHTMLElem.textContent}:
                ${currentObject.minutesHTMLElem.textContent}:
                ${currentObject.secondsHTMLElem.textContent}:
                ${currentObject.millisecondsHTMLElem.textContent}
            </td>`
        );
    }

    resetTimer(timerId) {
        const currentObject = this.findNeededTimerById(timerId);
        this.stopTimer(timerId);
        currentObject.timerInfo.isTimerNull = true; //обнуляем всю инфу
        currentObject.timerInfo.passedTime = 0;
        currentObject.timerInfo.timerLaps = 0;

        currentObject.timerHTMLElem.querySelector('tbody').textContent = '';

        currentObject.millisecondsHTMLElem.textContent = '000';
        currentObject.secondsHTMLElem.textContent = '00';
        currentObject.minutesHTMLElem.textContent = '00';
        currentObject.hoursHTMLElem.textContent = '00';
    }

    deleteTimer(timerId) {
        Timer.removeTimerFromStaticArray(timerId);
        [...mainWrapper.children].forEach((timerHTMLElem) => {
            if (timerHTMLElem.dataset.timerId === timerId) timerHTMLElem.remove();
        });
    }
}

if (localStorage.getItem('timers')) {
    JSON.parse(localStorage.getItem('timers')).forEach((timerInfoFromStorage) => {
        //проходимся по массиву таймеров из хранилища, и на их основе создаем новые объекты
        new Timer(timerInfoFromStorage.timerInfo.timerId, timerInfoFromStorage);
    });
}

document.querySelector('.btn-create-timer').addEventListener('click', () => {
    new Timer(Timer.findMaxTimerId() + 1); //чтобы айдишники таймеров не путались при удалении и добавлении, новому таймеру нужно давать максимальный айди из текущих
});

window.addEventListener('unload', updateStorage); //офигенная штука, обновлять хранилище, только сразу перед обновлением страницы, а не постоянно
