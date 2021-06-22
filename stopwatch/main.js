const btnControlsBlock = document.querySelector('.btn-controls-block');
const milliseconds = document.querySelector('.timer-milliseconds');
const seconds = document.querySelector('.timer-seconds');
const minutes = document.querySelector('.timer-minutes');
const hours = document.querySelector('.timer-hours');
const timerTableBody = document.querySelector('.timer-table tbody');
const tableWrap = document.querySelector('.table-wrap');

const timerInfo = {
    isTimerWorking: false,
    isTimerNull: true, //нужно для того, чтобы после паузы, продолжить считать время с того же места
    passedTime: 0, //засекает, сколько прошло между временем старта таймера, и его остановкой, необходимо для правильного продолжения отсчета после паузы
    timersQuantity: 0, //для количества таймеров в таблице
};

const startTimer = (neededToContinue) => {
    let start;

    //если нужно продолжить отсчет, то отнимаем предыдущее время, чтобы разница между start и
    //current(который ниже), не была равна 0, а была равна предыдущей разнице этих значений
    if (neededToContinue) start = Date.now() - timerInfo.passedTime;
    else start = Date.now();

    timerInfo.isTimerWorking = true;
    timerInfo.isTimerNull = false;

    const changeTime = () => {
        if (!timerInfo.isTimerWorking) return; //это свойство, которае может стать false и остановить анимацию, если нажмем на кнопку stop

        const current = Date.now();
        timerInfo.passedTime = current - start;

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

        checkIfOneDigit(milliseconds, (current - start) % 1000); //% 1000 - чтобы показывало только 3 цифры
        checkIfOneDigit(seconds, Math.floor((current - start) / 1000) % 60); //если не написать %, то после 60 секунд, значения для секунд не обнулятся
        checkIfOneDigit(minutes, Math.floor((current - start) / 1000 / 60) % 60);
        checkIfOneDigit(hours, Math.floor((current - start) / 1000 / 60 / 60) % 24);

        requestAnimationFrame(changeTime);
    };

    requestAnimationFrame(changeTime);
};

const stopTimer = () => {
    // cancelAnimationFrame(id); //через этот метод не получилось остановить, так как при каждом рекурсивном вызове
    //requestAnimationFrame(changeTime) создавался новый айди анимации и остановить ее можно только через return
    timerInfo.isTimerWorking = false;
};

const continueTimer = () => {
    startTimer(true);
};

const makeNewRound = () => {
    timerTableBody.insertAdjacentHTML(
        'afterbegin',
        `
    <td>${++timerInfo.timersQuantity}</td>
    <td>${hours.textContent}:${minutes.textContent}:${seconds.textContent}:${milliseconds.textContent}</td>
    `
    );
    console.log(milliseconds.textContent);
    // tableWrap.scrollTo(0, tableWrap.scrollHeight); //прокручиваем таблицу в конец
};

const resetTimer = () => {
    stopTimer();
    timerInfo.isTimerNull = true; //обнуляем всю инфу
    timerInfo.passedTime = 0;
    timerInfo.timersQuantity = 0;
    timerTableBody.textContent = '';

    milliseconds.textContent = '000';
    seconds.textContent = '00';
    milliseconds.textContent = '00';
    hours.textContent = '00';
};

btnControlsBlock.addEventListener('click', (event) => {
    const target = event.target;
    if (target.matches('.btn-start') && !timerInfo.isTimerWorking && timerInfo.isTimerNull) {
        startTimer();
        //если свойство timerInfo.isTimerNull === true,
        //то значит таймер обнуленный и можно начинать считать ОТ НУЛЯ
    } else if (target.matches('.btn-start') && !timerInfo.isTimerWorking && !timerInfo.isTimerNull) {
        continueTimer();
        //если свойство timerInfo.isTimerNull === false, то значит таймер имеет какое-то значение
        //и начинать считать нужно от этого значения, а НЕ ОТ НУЛЯ
    } else if (target.matches('.btn-stop') && timerInfo.isTimerWorking) {
        stopTimer(); //устанавливать, только если работает
    } else if (target.matches('.btn-round') && timerInfo.isTimerWorking) {
        makeNewRound(); //делать новый круг, только если таймер работает
    } else if (target.matches('.btn-reset')) {
        resetTimer(); //ресетить можно в любой момент
    }
});
