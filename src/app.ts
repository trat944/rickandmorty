import { myVariables } from "./variables/dom_variables.js";
import {MainInterface, Info, Episode, Seasons, Characters, Origin} from "./interfaces/index"


const fetchData = async (): Promise<Episode[]> => {
  try {
    const episodes: Episode[] = [];

    const response1 = await fetch('https://rickandmortyapi.com/api/episode');
    let data1: MainInterface = await response1.json();
    episodes.push(...data1.results);

    while (data1.info.next) {
      const response2 = await fetch(data1.info.next);
      const data2: MainInterface = await response2.json();
      episodes.push(...data2.results);
      data1 = data2;
    }
    return episodes;
  } catch (error) {
    throw Error
  }
}


fetchData()
  .then(episodes => createSeasons(episodes))
  .then(seasons => addEpisodes(seasons))
  .catch(() => console.log('Error in episode fetching'))


const createSeasons = (episodes: Episode[]) : Seasons => {
  const seasons: Seasons = {
    season1: [],
    season2: [],
    season3: [],
    season4: [],
    season5: []
  }
  fillSeasonWithEpisodes(seasons, episodes);
  return seasons;
}

const fillSeasonWithEpisodes = (seasons: Seasons, episodes: Episode[]): void => {
  episodes.forEach((episode) => {
    if (episode.id < 12) seasons.season1.push(episode);
    else if (episode.id >= 12 && episode.id < 22) seasons.season2.push(episode);
    else if (episode.id >= 22 && episode.id < 32) seasons.season3.push(episode);
    else if (episode.id >= 32 && episode.id < 42) seasons.season4.push(episode);
    else if (episode.id >= 42 && episode.id < 52) seasons.season5.push(episode);
  })
}


const addEpisodes = (seasons: Seasons) : void => {
  const {seasonButtons} = myVariables;
  seasonButtons.forEach(button => {
    const seasonNumber: number = Number(button.classList.value);
    button.addEventListener('click', () => {
      cleanSeasonContainers();
      const targetedSeason = targetSeason(seasons, seasonNumber);
      printEpisodesSidebar(seasonNumber, targetedSeason);
    })
  })
}

const cleanSeasonContainers = (): void => {
  const {seasonContainers} = myVariables;
  seasonContainers.forEach(container => {
    cleanDivContainer(container)
  })
}

const targetSeason = (seasons: Seasons, seasonNumber: number) : Episode[] => {
  const seasonArray: Episode[][] = [seasons.season1, seasons.season2, seasons.season3, seasons.season4, seasons.season5];
  const selectedSeason = seasonArray[seasonNumber - 1];
  return selectedSeason;
}

const printEpisodesSidebar = (seasonNumber: number, targetedSeason: Episode[]) : void => {
  targetedSeason.forEach(episode => {
    const container = document.querySelector(`.container_${seasonNumber}`) as HTMLDivElement;
    const episodePrinted = document.createElement('button') as HTMLButtonElement;
    episodePrinted.textContent = `Episode ${episode.episode.slice(4)}`;
    episodePrinted.classList.add('episodeBtn');
    container.appendChild(episodePrinted);
    addEventsToEpisodes(episode, episodePrinted);
  })
}

const addEventsToEpisodes = (episode: Episode, episodePrinted: HTMLButtonElement): void => {
  const {charactersContainer, episodeContainer, characterContainer, originDisplayer} = myVariables;
  episodePrinted.addEventListener('click', () => {
    cleanDivContainer(charactersContainer)
    displayEpisodeContainer(episode);
    fetchCharactersEpisodeContainer(episode)
    if (originDisplayer.classList.contains('hidden')) {
      changeContainer(episodeContainer, characterContainer);
    } else {
      changeContainer(episodeContainer, originDisplayer);
    }
  })
}


const displayEpisodeContainer = (episode: Episode): void => {
  const {episodeNameContainer, airDateandEpisodeContainer} = myVariables;
  episodeNameContainer.textContent = episode.name;
  airDateandEpisodeContainer.textContent = `${episode.air_date}  |  ${episode.episode}`;
}

const fetchCharactersEpisodeContainer = async (episode: Episode): Promise<void> => {
  const {charactersContainer} = myVariables;
  const charactersURL: string[] = episode.characters;
  charactersURL.forEach(character => {
    fetch(character)
      .then(response => response.json())
      .then(data => {
        printCharacters(data, charactersContainer);
        triggerCharacterContainer();
      })
      .catch(() => console.log('Error in printing characters'))
  })
}


const triggerCharacterContainer = (): void => {
  const cards = document.querySelectorAll('.characterCard') as NodeListOf<Element>;
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const characterId: number = Number(card.getAttribute(`character-id`));
      fetchCharacterContainer(characterId);
    })
  })
}


const fetchCharacterContainer = async (characterId: number): Promise<void> => {
 try{
  const {episodeContainer, characterContainer, episodesOfCharacter, originDisplayer} = myVariables;
  const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
  const character: Characters = await response.json();
  if (originDisplayer.classList.contains('hidden')) {
    changeContainer(characterContainer, episodeContainer);
  } else {
    changeContainer(characterContainer, originDisplayer);
  }
  cleanDivContainer(episodesOfCharacter);
  const characterOrigin = printCharacterContainer(character);
  displayEpisodesOfCharacter(character);
  fetchOriginEvent(characterOrigin, character);
 } catch(error) {
  console.log(error)
 }
}

const printCharacterContainer = (character: Characters):HTMLSpanElement => {
  const {characterImg, characterName, characterSpecifics, characterOrigin, characterContainer, originDisplayer} = myVariables;
  characterImg.src = character.image;
  characterName.textContent = character.name;
  characterSpecifics.textContent = `${character.species} | ${character.status} | ${character.gender} | `
  characterOrigin.textContent = character.origin.name;
  return characterOrigin;
}

const displayEpisodesOfCharacter = (character: Characters): void => {
  const {episodesOfCharacter} = myVariables;
    character.episode.forEach(episode => {
    const episodeCharacterAppears = document.createElement('span');
    episodeCharacterAppears.textContent = `Episode ${episode.slice(40)}`;
    episodeCharacterAppears.classList.add("episodeOfCharacter");
    episodesOfCharacter.appendChild(episodeCharacterAppears);
    triggerEventEpisodesOfCharacter(episodeCharacterAppears, episode)
  })
}

const triggerEventEpisodesOfCharacter = async (episodeCharacterAppears: HTMLSpanElement, episode: string): Promise<void> => {
  try{
    const {episodeContainer, characterContainer, charactersContainer} = myVariables;
    const response = await fetch(episode);
    const data: Episode = await response.json();
    episodeCharacterAppears.addEventListener('click', () => {
    changeContainer(episodeContainer, characterContainer);
    displayEpisodeContainer(data);
    cleanDivContainer(charactersContainer);
    fetchCharactersEpisodeContainer(data);
  })
  } catch (error) {
    console.error('Error fetching episode data:', error);
  }
}

const fetchOriginEvent = (characterOrigin: HTMLSpanElement, character: Characters): void => {
  const {originDisplayer, characterContainer, residentsContainer} = myVariables;
    characterOrigin.addEventListener('click',() => {
    if (characterOrigin.textContent !== "unknown") {
      cleanDivContainer(residentsContainer);
      changeContainer(originDisplayer, characterContainer);
      fetchOriginOfCharacter(character.origin.url);
    }
  })
}


const fetchOriginOfCharacter = async (originUrl: string): Promise<void> => {
  try{
    const response = await fetch(originUrl);
    const data: Origin = await response.json();
    printOrigin(data);
  } catch (error) {
    throw Error;
  }
}


const printOrigin = async (origin : Origin): Promise<void> => {
  const {originDisplayer, planetName, originSpecifics, residentsContainer, characterContainer, charactersContainer} = myVariables;
  cleanDivContainer(residentsContainer);
  planetName.textContent = origin.name;
  originSpecifics.textContent = `${origin.type}  |  ${origin.dimension}`;
  cleanDivContainer(charactersContainer);
  origin.residents.forEach(resident => {
    fetch(resident)
      .then(response => response.json())
      .then((data) => {
        cleanDivContainer(charactersContainer);
        changeContainer(originDisplayer, characterContainer)
        printCharacters(data, residentsContainer);
        triggerCharacterContainer();
      })
      .catch(() => console.log('Error in fetching origin'))
  })
}


const printCharacters = (character: Characters, container: HTMLDivElement) => {
  const characterCard = 
  `<div class="card characterCard" character-id="${character.id}" style="width: 18rem;">
  <img class="card-img-top" src="https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${character.name}</h5>
    <span> ${character.species}  |  ${character.status}</span>
  </div>
  </div>`;
  container.innerHTML += characterCard;
}


const changeContainer = (showingContainer: HTMLDivElement, hidingContainer: HTMLDivElement): void => {
  hidingContainer.classList.add('hidden');
  showingContainer.classList.remove('hidden');
}

const cleanDivContainer = (container: HTMLDivElement | Element): void => {
  container.innerHTML="";
}


