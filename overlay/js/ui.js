
const state = {
    length: null
}

const elements = {
    scoreStats: null,
    time: null,
    score: null,
    accuracy: null,
    combo: null,
    mapInfo: null,
    preBsr: null,
    beatmapImage: null,
    bsr: null,
    mapper: null,
    artist: null,
    songName: null,
    stars: null,
    maxPerformancePoints: null,
    difficultyName: null,
    scoresaberInfo: null,
}

window.addEventListener("load", () => {
    // if (urlParams.has("hideStats")) { times.forEach(e => { e.parentElement.style.display = "none"; }); }
    // if (urlParams.has("hideMapDetails")) { bsrContainer.forEach(e => { e.parentElement.style.display = "none"; }); }
    // if (urlParams.has("hideModifiersHealth")) { document.querySelectorAll(".IF").forEach(e => { e.parentElement.parentElement.style.display = "none"; }); }
    // if (urlParams.has('hideScoreSaberInfo')) { document.querySelector('.scoreSaberInfo').style.display = 'none' }
    if (urlParams.has('scoresaberPlayerId')) {
        state.scoresaberPlayerId = urlParams.get('scoresaberPlayerId')
    }

    if (urlParams.has('bgColor')) {
        document.documentElement.style.setProperty('--bg-colour', urlParams.get('bgColor').replace(/^#?/, '#'), 'important')
    }

    if (urlParams.has('textColor')) {
        document.documentElement.style.setProperty('--text-colour', urlParams.get('textColor').replace(/^#?/, '#'), 'important')
    }

    window.addEventListener("WebsocketReconnect", () => { displaySongOverlay(false); });
    window.addEventListener("LiveDataConnected", () => { displaySongOverlay(true) });

    elements.scoreStats = document.querySelector('.scoreStats')
    elements.time = document.querySelector(".time");
    elements.score = document.querySelector(".score");
    elements.accuracy = document.querySelector(".accuracy");
    elements.combo = document.querySelector(".combo");

    elements.mapInfo = document.querySelector('.mapInfo')
    elements.preBsr = document.querySelector(".preBSR");
    elements.beatmapImage = document.querySelector(".beatmapImage");
    elements.bsr = document.querySelector(".bsr");
    elements.mapper = document.querySelector(".mapper");
    elements.artist = document.querySelector(".artist");
    elements.songName = document.querySelector(".song");
    elements.stars = document.querySelector('.stars')
    elements.maxPerformancePoints = document.querySelector('.maxPP')
    elements.difficultyName = document.querySelector('.difficultyName')
    elements.scoresaberInfo = document.querySelector('.scoresaberInfo')

    updateScoresaberInfo()
})

window.addEventListener("MapDataUpdated", ({ detail: data }) => {
    const wasInLevel = state.inLevel
    state.inLevel = data.InLevel

    elements.beatmapImage.src = data.coverImage || "assets/BeatSaberIcon.jpg";

    elements.bsr.textContent = data.BSRKey ? `!bsr ${data.BSRKey}` : '';

    elements.mapper.textContent = data.Mapper ? data.Mapper : "Mapper";
    elements.artist.textContent = data.SongAuthor ? data.SongAuthor : "ArtistName";
    elements.songName.textContent = data.SongName ? data.SongName : "SongName";

    elements.preBsr.textContent = data.PreviousBSR ? `(${data.PreviousBSR})` : ''

    elements.stars.textContent = `${data.Star}☆`
    elements.maxPerformancePoints.textContent = `${data.PP | 0}pp`
    elements.difficultyName.textContent = data.Difficulty.replace('Plus', '+')

    state.mapLength = SecondsToMins(data.Length)

    elements.time.textContent = `00:00/${state.mapLength}`

    displaySongOverlay(state.inLevel)

    if (wasInLevel && !state.inLevel && state.scoresaberPlayerId) {
        updateScoresaberInfo()
    }
})

window.addEventListener("LiveDataUpdated", ({ detail: data }) => {
    elements.time.textContent = `${SecondsToMins(data.TimeElapsed)}/${state.mapLength}`;
    elements.score.textContent = data.Score.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ',');
    elements.accuracy.textContent = `${data.Accuracy.toFixed(2)}%`;
    elements.combo.textContent = data.Combo.toString().replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ',');
})

async function updateScoresaberInfo() {
    if (!state.scoresaberPlayerId) {
        elements.scoresaberInfo.style.visibility = 'hidden'
    }
    const scoresaber = new ScoresaberClient()
    const response = await scoresaber.getPlayerInfo(state.scoresaberPlayerId)
    if (response) {
        const { playerInfo } = response
        elements.scoresaberInfo.textContent = `${playerInfo.playerName} #${playerInfo.rank} (#${playerInfo.countryRank} ${playerInfo.country}) ${playerInfo.pp.toFixed(2)}pp`
        elements.scoresaberInfo.style.visibility = 'visible'
    }
}

function SecondsToMins(seconds) {
    let Mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    let Seconds = (seconds - (Math.floor(seconds / 60) * 60)).toString().padStart(2, "0");
    return `${Mins}:${Seconds}`;
}

function displaySongOverlay(show) {
    elements.mapInfo.style.visibility = show ? 'visible' : 'hidden'
    elements.scoreStats.style.visibility = show ? 'visible' : 'hidden'
}
