const templateTimer = `
    
    <div class="timer-block">
        <span class="timer-hours">00</span>
        <span>:</span>
        <span class="timer-minutes">00</span>
        <span>:</span>
        <span class="timer-seconds">00</span>
        <span>:</span>
        <span class="timer-milliseconds">000</span>
    </div>

    <div class="btn-controls-block">
        <button class="btn btn-start">Start</button>
        <button class="btn btn-stop">Stop</button>
        <button class="btn btn-round">Create new round</button>
        <button class="btn btn-reset">Reset</button>
        <button class="btn-delete">X</button>
    </div>

    <div class="table-wrap">
        <table class="timer-table">
            <thead>
                <tr>
                    <th>№</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
`;

export default templateTimer;
