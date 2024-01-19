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
fetchData()
    .then(episodes => createSeasons(episodes))
    .then(seasons => addEpisodes(seasons))
    .catch(() => console.log('Error in episode fetching'));
const createSeasons = (episodes) => {
    const seasons = {
        season1: [],
        season2: [],
        season3: [],
        season4: [],
        season5: []
    };
    fillSeasonWithEpisodes(seasons, episodes);
    return seasons;
};
const fillSeasonWithEpisodes = (seasons, episodes) => {
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
};
const addEpisodes = (seasons) => {
    const { seasonButtons } = myVariables;
    seasonButtons.forEach(button => {
        const seasonNumber = Number(button.classList.value);
        button.addEventListener('click', () => {
            cleanSeasonContainers();
            const targetedSeason = targetSeason(seasons, seasonNumber);
            printEpisodesSidebar(seasonNumber, targetedSeason);
        });
    });
};
const cleanSeasonContainers = () => {
    const { seasonContainers } = myVariables;
    seasonContainers.forEach(container => {
        cleanDivContainer(container);
    });
};
const targetSeason = (seasons, seasonNumber) => {
    const seasonArray = [seasons.season1, seasons.season2, seasons.season3, seasons.season4, seasons.season5];
    const selectedSeason = seasonArray[seasonNumber - 1];
    return selectedSeason;
};
const printEpisodesSidebar = (seasonNumber, targetedSeason) => {
    targetedSeason.forEach(episode => {
        const container = document.querySelector(`.container_${seasonNumber}`);
        const episodePrinted = document.createElement('button');
        episodePrinted.textContent = `Episode ${episode.episode.slice(4)}`;
        episodePrinted.classList.add('episodeBtn');
        container.appendChild(episodePrinted);
        addEventsToEpisodes(episode, episodePrinted);
    });
};
const addEventsToEpisodes = (episode, episodePrinted) => {
    const { charactersContainer, episodeContainer, characterContainer, originDisplayer } = myVariables;
    episodePrinted.addEventListener('click', () => {
        cleanDivContainer(charactersContainer);
        displayEpisodeContainer(episode);
        fetchCharactersEpisodeContainer(episode);
        if (originDisplayer.classList.contains('hidden')) {
            changeContainer(episodeContainer, characterContainer);
        }
        else {
            changeContainer(episodeContainer, originDisplayer);
        }
    });
};
const displayEpisodeContainer = (episode) => {
    const { episodeNameContainer, airDateandEpisodeContainer } = myVariables;
    episodeNameContainer.textContent = episode.name;
    airDateandEpisodeContainer.textContent = `${episode.air_date}  |  ${episode.episode}`;
};
const fetchCharactersEpisodeContainer = (episode) => __awaiter(void 0, void 0, void 0, function* () {
    const { charactersContainer } = myVariables;
    const charactersURL = episode.characters;
    charactersURL.forEach(character => {
        fetch(character)
            .then(response => response.json())
            .then(data => {
            printCharacters(data, charactersContainer);
            triggerCharacterContainer();
        })
            .catch(() => console.log('Error in printing characters'));
    });
});
const triggerCharacterContainer = () => {
    const cards = document.querySelectorAll('.characterCard');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const characterId = Number(card.getAttribute(`character-id`));
            fetchCharacterContainer(characterId);
        });
    });
};
const fetchCharacterContainer = (characterId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { episodeContainer, characterContainer, episodesOfCharacter, originDisplayer } = myVariables;
        const response = yield fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
        const character = yield response.json();
        if (originDisplayer.classList.contains('hidden')) {
            changeContainer(characterContainer, episodeContainer);
        }
        else {
            changeContainer(characterContainer, originDisplayer);
        }
        cleanDivContainer(episodesOfCharacter);
        const characterOrigin = printCharacterContainer(character);
        displayEpisodesOfCharacter(character);
        fetchOriginEvent(characterOrigin, character);
    }
    catch (error) {
        console.log(error);
    }
});
const printCharacterContainer = (character) => {
    const { characterImg, characterName, characterSpecifics, characterOrigin, characterContainer, originDisplayer } = myVariables;
    characterImg.src = character.image;
    characterName.textContent = character.name;
    characterSpecifics.textContent = `${character.species} | ${character.status} | ${character.gender} | `;
    characterOrigin.textContent = character.origin.name;
    return characterOrigin;
};
const displayEpisodesOfCharacter = (character) => {
    const { episodesOfCharacter } = myVariables;
    character.episode.forEach(episode => {
        const episodeCharacterAppears = document.createElement('span');
        episodeCharacterAppears.textContent = `Episode ${episode.slice(40)}`;
        episodeCharacterAppears.classList.add("episodeOfCharacter");
        episodesOfCharacter.appendChild(episodeCharacterAppears);
        triggerEventEpisodesOfCharacter(episodeCharacterAppears, episode);
    });
};
const triggerEventEpisodesOfCharacter = (episodeCharacterAppears, episode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { episodeContainer, characterContainer, charactersContainer } = myVariables;
        const response = yield fetch(episode);
        const data = yield response.json();
        episodeCharacterAppears.addEventListener('click', () => {
            changeContainer(episodeContainer, characterContainer);
            displayEpisodeContainer(data);
            cleanDivContainer(charactersContainer);
            fetchCharactersEpisodeContainer(data);
        });
    }
    catch (error) {
        console.error('Error fetching episode data:', error);
    }
});
const fetchOriginEvent = (characterOrigin, character) => {
    const { originDisplayer, characterContainer, residentsContainer } = myVariables;
    characterOrigin.addEventListener('click', () => {
        if (characterOrigin.textContent !== "unknown") {
            cleanDivContainer(residentsContainer);
            changeContainer(originDisplayer, characterContainer);
            fetchOriginOfCharacter(character.origin.url);
        }
    });
};
const fetchOriginOfCharacter = (originUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(originUrl);
        const data = yield response.json();
        printOrigin(data);
    }
    catch (error) {
        throw Error;
    }
});
const printOrigin = (origin) => __awaiter(void 0, void 0, void 0, function* () {
    const { originDisplayer, planetName, originSpecifics, residentsContainer, characterContainer, charactersContainer } = myVariables;
    cleanDivContainer(residentsContainer);
    planetName.textContent = origin.name;
    originSpecifics.textContent = `${origin.type}  |  ${origin.dimension}`;
    cleanDivContainer(charactersContainer);
    origin.residents.forEach(resident => {
        fetch(resident)
            .then(response => response.json())
            .then((data) => {
            cleanDivContainer(charactersContainer);
            changeContainer(originDisplayer, characterContainer);
            printCharacters(data, residentsContainer);
            triggerCharacterContainer();
        })
            .catch(() => console.log('Error in fetching origin'));
    });
});
const printCharacters = (character, container) => {
    const characterCard = `<div class="card characterCard" character-id="${character.id}" style="width: 18rem;">
  <img class="card-img-top" src="https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${character.name}</h5>
    <span> ${character.species}  |  ${character.status}</span>
  </div>
  </div>`;
    container.innerHTML += characterCard;
};
const changeContainer = (showingContainer, hidingContainer) => {
    hidingContainer.classList.add('hidden');
    showingContainer.classList.remove('hidden');
};
const cleanDivContainer = (container) => {
    container.innerHTML = "";
};
//# sourceMappingURL=app.js.map