var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const episodes = [];
        const response1 = yield fetch('https://rickandmortyapi.com/api/episode');
        let data1 = yield response1.json();
        episodes.push(...data1.results);
        while (data1.info.next) {
            const response2 = yield fetch(data1.info.next);
            const data2 = yield response2.json();
            episodes.push(...data2.results);
            data1 = data2;
        }
        return episodes;
    }
    catch (error) {
        throw Error;
    }
});
const createSeasons = (episodes) => {
    const seasons = {
        season1: [],
        season2: [],
        season3: [],
        season4: [],
        season5: []
    };
    episodes.forEach((episode) => {
        if (episode.id < 12)
            seasons.season1.push(episode);
        else if (episode.id >= 12 && episode.id < 22)
            seasons.season2.push(episode);
        else if (episode.id >= 22 && episode.id < 32)
            seasons.season3.push(episode);
        else if (episode.id >= 32 && episode.id < 42)
            seasons.season4.push(episode);
        else if (episode.id >= 42 && episode.id < 52)
            seasons.season5.push(episode);
    });
    console.log(seasons);
    return seasons;
};
const displaySeasons = (seasons) => {
    const seasonButtons = document.querySelectorAll('[data-number="seasonBtn"]');
    seasonButtons.forEach(button => {
        const seasonNumber = Number(button.classList.value);
        button.addEventListener('click', () => {
            const containers = document.querySelectorAll('.episodeContainer');
            containers.forEach(container => {
                container.textContent = "";
            });
            printSeason(seasons, seasonNumber);
        });
    });
};
const printSeason = (seasons, seasonNumber) => {
    const { season1, season2, season3, season4, season5 } = seasons;
    const seasonArray = [season1, season2, season3, season4, season5];
    const selectedSeason = seasonArray[seasonNumber - 1];
    selectedSeason.forEach(episode => {
        const container = document.querySelector(`.container_${seasonNumber}`);
        const episodePrinted = document.createElement('p');
        episodePrinted.textContent = `Episode ${episode.episode.slice(4)}`;
        container.appendChild(episodePrinted);
    });
};
fetchData()
    .then(episodes => createSeasons(episodes))
    .then(seasons => displaySeasons(seasons));
export {};
//# sourceMappingURL=app.js.map