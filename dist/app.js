var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { myVariables } from "./variables/dom_variables.js";
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
    return seasons;
};
const displaySeasons = (seasons) => {
    const { seasonButtons, containers } = myVariables;
    seasonButtons.forEach(button => {
        const seasonNumber = Number(button.classList.value);
        button.addEventListener('click', () => {
            containers.forEach(container => {
                container.innerHTML = "";
            });
            printSeason(seasons, seasonNumber);
        });
    });
};
const printSeason = (seasons, seasonNumber) => {
    const { charactersContainer, episodeContainer, characterContainer } = myVariables;
    const { season1, season2, season3, season4, season5 } = seasons;
    const seasonArray = [season1, season2, season3, season4, season5];
    const selectedSeason = seasonArray[seasonNumber - 1];
    selectedSeason.forEach(episode => {
        const container = document.querySelector(`.container_${seasonNumber}`);
        const episodePrinted = document.createElement('button');
        episodePrinted.textContent = `Episode ${episode.episode.slice(4)}`;
        episodePrinted.classList.add('episodeBtn');
        episodePrinted.addEventListener('click', () => {
            changeContainer(episodeContainer, characterContainer);
            displayEpisodeInfo(episode);
            charactersContainer.innerHTML = "";
            fetchCharacters(episode);
        });
        container.appendChild(episodePrinted);
    });
};
const displayEpisodeInfo = (episode) => {
    const { episodeNameContainer, airDateandEpisodeContainer } = myVariables;
    episodeNameContainer.textContent = episode.name;
    airDateandEpisodeContainer.textContent = `${episode.air_date}  |  ${episode.episode}`;
};
const fetchCharacters = (episode) => __awaiter(void 0, void 0, void 0, function* () {
    const charactersURL = episode.characters;
    charactersURL.forEach(character => {
        fetch(character)
            .then(response => response.json())
            .then(data => {
            printCharacters(data);
        });
    });
});
const printCharacters = (character) => {
    const { charactersContainer } = myVariables;
    const characterCard = `<div class="card characterCard" character-id="${character.id}" style="width: 18rem;">
    <img class="card-img-top" src="https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${character.name}</h5>
      <span> ${character.species}  |  ${character.status}</span>
    </div>
    </div>`;
    charactersContainer.innerHTML += characterCard;
    displayCharacterInfo();
};
const displayCharacterInfo = () => {
    const cards = document.querySelectorAll('.characterCard');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const characterId = Number(card.getAttribute(`character-id`));
            fetchCharacter(characterId);
        });
    });
};
const fetchCharacter = (characterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { episodeContainer, characterContainer } = myVariables;
        const response = yield fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
        const character = yield response.json();
        changeContainer(characterContainer, episodeContainer);
        printCharacterInfo(character);
    }
    catch (error) {
        console.log(error);
    }
});
const printCharacterInfo = (character) => {
    const { characterImg, characterName, characterSpecifics, episodesOfCharacter } = myVariables;
    characterImg.src = character.image;
    characterName.textContent = character.name;
    characterSpecifics.textContent = `${character.species} | ${character.status} | ${character.gender} | ${character.origin.name}`;
    character.episode.forEach(episode => {
        const episodeCharacterAppears = document.createElement('span');
        episodeCharacterAppears.textContent = `Episode ${episode.slice(40)}`;
        episodesOfCharacter.appendChild(episodeCharacterAppears);
    });
};
const changeContainer = (showingContainer, hidingContainer) => {
    hidingContainer.classList.add('hidden');
    showingContainer.classList.remove('hidden');
};
fetchData()
    .then(episodes => createSeasons(episodes))
    .then(seasons => displaySeasons(seasons));
//# sourceMappingURL=app.js.map