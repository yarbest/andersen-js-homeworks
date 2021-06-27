import templateTimer from './template-timer.js';

const mainWrapper = document.querySelector('.main-wrapper');

class Timer {
    static timersArray = []; //по этому массиву буду искать нужный таймер

    constructor(timerId) {
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
    }
    createTimer() {
        const newTimer = document.createElement('div');
        newTimer.classList.add('timer-wrapper');
        newTimer.dataset.timerId = this.timerInfo.timerId;
        newTimer.innerHTML = templateTimer;

        newTimer.querySelector('.btn-controls-block').addEventListener('click', (event) => {
            const target = event.target;
            if (target.matches('.btn-start') && !this.timerInfo.isTimerWorking && this.timerInfo.isTimerNull) {
                this.startTimer(target.closest('[data-timer-id]').dataset.timerId);
                //в зависимости от нажатой кнопки, поднимаемся к ее родителю, у которого есть дата атрибут-айди
                //этот айди таймера поможет определить, какой таймер запускать, останавливать и т.д.
            } else if (target.matches('.btn-start') && !this.timerInfo.isTimerWorking && !this.timerInfo.isTimerNull) {
                this.continueTimer(target.closest('[data-timer-id]').dataset.timerId);
            } else if (target.matches('.btn-stop') && this.timerInfo.isTimerWorking) {
                this.stopTimer(target.closest('[data-timer-id]').dataset.timerId);
            } else if (target.matches('.btn-round') && this.timerInfo.isTimerWorking) {
                this.makeNewRound(target.closest('[data-timer-id]').dataset.timerId);
            } else if (target.matches('.btn-reset')) {
                this.resetTimer(target.closest('[data-timer-id]').dataset.timerId);
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
    //!!!!!
    resetTimer(timerId) {
        const currentObject = this.findNeededTimerById(timerId);
        console.log(currentObject.timerHTMLElem.querySelector('.timer-milliseconds'));
        this.stopTimer(timerId);
        currentObject.timerInfo.isTimerNull = true; //обнуляем всю инфу
        currentObject.timerInfo.passedTime = 0;
        currentObject.timerInfo.timerLaps = 0;

        currentObject.timerHTMLElem.querySelector('tbody').textContent = '';

        //этот поиск повторяется, нужно исправить!!!!!
        currentObject.millisecondsHTMLElem.textContent = '000';
        currentObject.secondsHTMLElem.textContent = '00';
        currentObject.minutesHTMLElem.textContent = '00';
        currentObject.hoursHTMLElem.textContent = '00';
    }
}

Timer.timersArray.push(new Timer(Timer.timersArray.length + 1)); //сразу создаем первый таймер, в конструктор передается айди таймера

document.querySelector('.btn-create-timer').addEventListener('click', () => {
    Timer.timersArray.push(new Timer(Timer.timersArray.length + 1));
});
