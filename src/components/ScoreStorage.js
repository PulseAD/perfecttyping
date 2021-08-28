class ScoreStorage {

    scoreLimit = 10;

    saveScore(uuid, wpm, isHardcore) {
        const date = Date.now();
        const newScore = {
            uuid, wpm, date, isHardcore
        };
        console.log(newScore);

        let scores = localStorage.getItem('scores');
        if (scores) {
            console.log('add score');
            this.addScoreToStorage(newScore);
        } else {
            console.log('init score');
            this.initScoreStorage(newScore);
        }
    }

    initScoreStorage(newScore) {
        let scores = [];
        scores.push(newScore);
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    addScoreToStorage(newScore) {
        let scores = JSON.parse(localStorage.getItem('scores'));
        scores.push(newScore);
        localStorage.setItem('scores', JSON.stringify(scores));
    }

    obtainScores(uuid, isHardcore) {
        let scores = localStorage.getItem('scores');
        if (!scores) {
            return [];
        }
        scores = JSON.parse(scores);
        let filteredScores = [];
        for (let i = 0 ; i < scores.length ; ++i) {
            if (scores[i].uuid == uuid && scores[i].isHardcore == isHardcore) {
                filteredScores.push(scores[i]);
            }
        }
        return this.sortScores(filteredScores).slice(0, this.scoreLimit);
    }

    resetAllScores() {
        localStorage.removeItem('scores');
    }

    sortScores(scores) {
        scores.sort(function (a, b) {
            let keyA = a.wpm;
            let keyB = b.wpm;
            if (keyA > keyB) return -1;
            if (keyA < keyB) return 1;
            return 0;
        });
        return scores;
    }

}

export default ScoreStorage;