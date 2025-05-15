document.addEventListener('DOMContentLoaded', function () {
    const MAX_LENGTH_PX = 400;
    const SCALE = MAX_LENGTH_PX / 3.5;

    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const lengthInput = document.getElementById('length');
    const angleInput = document.getElementById('angle');
    const periodOutput = document.getElementById('period');
    const gravityOutput = document.getElementById('gravity');
    const timerDisplay = document.getElementById('timer');
    const countDisplay = document.getElementById('count');

    const pendulum = document.querySelector('.pendulum');
    const string = document.querySelector('.string');
    const bob = document.querySelector('.bob');

    let animationId = null;
    let startTime = null;
    let isPaused = false;
    let pauseTime = 0;
    let oscillationCount = 0;
    let lastZeroCrossing = 0;
    let measuredPeriods = [];
    let lastTime = 0;
    let timerInterval = null;
    let elapsedTime = 0;

    function initPendulum() {
        const length = Math.min(parseFloat(lengthInput.value), 3.5);
        const angle = parseFloat(angleInput.value) * Math.PI / 180;

        string.style.height = `${length * SCALE}px`;
        bob.style.top = `${length * SCALE}px`;

        pendulum.style.transform = `translateX(-50%) rotate(${angle}rad)`;

        // Логирование параметров
        console.log(`Инициализация маятника: Длина = ${length} м, Угол = ${angle * 180 / Math.PI}°`);
    }

    function updateTimer() {
        elapsedTime += 0.01;
        timerDisplay.textContent = elapsedTime.toFixed(2);
    }

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        if (isPaused) {
            pauseTime = timestamp - lastTime;
            return;
        }

        const elapsed = (timestamp - startTime - pauseTime) / 1000;
        const length = Math.min(parseFloat(lengthInput.value), 3.5);
        const initialAngle = parseFloat(angleInput.value) * Math.PI / 180;

        const omega = Math.sqrt(9.8 / length);
        const currentAngle = initialAngle * Math.cos(omega * elapsed);

        pendulum.style.transform = `translateX(-50%) rotate(${currentAngle}rad)`;

        // Логирование текущего угла и вычисленного периода
        console.log(`Текущий угол: ${currentAngle * 180 / Math.PI}°`);

        if (Math.abs(currentAngle) < 0.05 && (timestamp - lastZeroCrossing) > 100) {
            oscillationCount += 0.5;
            countDisplay.textContent = oscillationCount;

            const currentPeriod = 2 * (timestamp - lastZeroCrossing) / 1000;
            lastZeroCrossing = timestamp;

            console.log(`Период колебаний (текущий): ${currentPeriod.toFixed(3)} сек`);

            if (oscillationCount >= 1) {
                measuredPeriods.push(currentPeriod);
                if (measuredPeriods.length > 3) measuredPeriods.shift();

                const avgPeriod = measuredPeriods.reduce((a, b) => a + b, 0) / measuredPeriods.length;
                console.log(`Средний период (последние 3 колебания): ${avgPeriod.toFixed(3)} сек`);

                $.ajax({
                    type: "POST",
                    url: "/pendulum",
                    contentType: "application/json",
                    data: JSON.stringify({
                        length: parseFloat(length),
                        angle: parseFloat(angleInput.value)
                    }),
                    success: function (data) {
                        periodOutput.textContent = data.period.toFixed(3);
                        gravityOutput.textContent = data.gravity.toFixed(3);

                        // Логирование результатов от сервера
                        console.log(`Ответ от сервера: Период = ${data.period.toFixed(3)} сек, Ускорение = ${data.gravity.toFixed(3)} м/с²`);
                    },
                    error: function (xhr) {
                        alert("Ошибка при вычислении на сервере: " + xhr.responseText);
                    }
                });
            }
        }

        lastTime = timestamp;
        animationId = requestAnimationFrame(animate);
    }

    startBtn.addEventListener('click', function () {
        if (!animationId) {
            initPendulum();
            oscillationCount = 0;
            lastZeroCrossing = 0;
            measuredPeriods = [];
            elapsedTime = 0;
            startTime = null;
            pauseTime = 0;
            countDisplay.textContent = '0';
            timerInterval = setInterval(updateTimer, 10);
            requestAnimationFrame(animate);
        } else if (isPaused) {
            isPaused = false;
            timerInterval = setInterval(updateTimer, 10);
            requestAnimationFrame(animate);
        }
    });

    pauseBtn.addEventListener('click', function () {
        isPaused = true;
        clearInterval(timerInterval);
    });

    resetBtn.addEventListener('click', function () {
        cancelAnimationFrame(animationId);
        animationId = null;
        isPaused = false;
        elapsedTime = 0;
        clearInterval(timerInterval);
        timerDisplay.textContent = '0.00';
        startTime = null;
        pauseTime = 0;
        oscillationCount = 0;
        lastZeroCrossing = 0;
        measuredPeriods = [];
        initPendulum();
        periodOutput.textContent = '-';
        gravityOutput.textContent = '-';
        countDisplay.textContent = '0';
    });

    initPendulum();
});


