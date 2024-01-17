import { myVariables } from "./variables/dom_variables.js";
import {MainInterface, Info, Episode, Seasons, Characters} from "./interfaces/index"

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


const createSeasons = (episodes: Episode[]) : Seasons => {
  const seasons: Seasons = {
    season1: [],
    season2: [],
    season3: [],
    season4: [],
    season5: []
  }
  episodes.forEach((episode) => {
    if (episode.id < 12) seasons.season1.push(episode);
    else if (episode.id >= 12 && episode.id < 22) seasons.season2.push(episode);
    else if (episode.id >= 22 && episode.id < 32) seasons.season3.push(episode);
    else if (episode.id >= 32 && episode.id < 42) seasons.season4.push(episode);
    else if (episode.id >= 42 && episode.id < 52) seasons.season5.push(episode);
  })
  return seasons;
}


const displaySeasons = (seasons: Seasons) : void => {
  const {seasonButtons, containers} = myVariables;
  seasonButtons.forEach(button => {
    const seasonNumber: number = Number(button.classList.value);
    button.addEventListener('click', () => {
      containers.forEach(container => {
        container.innerHTML = "";
      })
      printSeason(seasons, seasonNumber);
    })
  })
}


const printSeason = (seasons: Seasons, seasonNumber: number) : void => {
  const {charactersContainer, episodeContainer, characterContainer} = myVariables;
  const {season1, season2, season3, season4, season5} = seasons;
 
  const seasonArray: Episode[][] = [season1, season2, season3, season4, season5];
  const selectedSeason = seasonArray[seasonNumber - 1];

  selectedSeason.forEach(episode => {
    const container = document.querySelector(`.container_${seasonNumber}`) as HTMLDivElement;
    const episodePrinted = document.createElement('button') as HTMLButtonElement;
    episodePrinted.textContent = `Episode ${episode.episode.slice(4)}`;
    episodePrinted.classList.add('episodeBtn');
    episodePrinted.addEventListener('click', () => {
      changeContainer(episodeContainer, characterContainer);
      displayEpisodeInfo(episode);
      charactersContainer.innerHTML = "";
      fetchCharacters(episode)
    })
    container.appendChild(episodePrinted);
  })
}


const displayEpisodeInfo = (episode: Episode): void => {
  const {episodeNameContainer, airDateandEpisodeContainer} = myVariables;
  episodeNameContainer.textContent = episode.name;
  airDateandEpisodeContainer.textContent = `${episode.air_date}  |  ${episode.episode}`;
}


const fetchCharacters = async (episode: Episode): Promise<void> => {
  const charactersURL: string[] = episode.characters;
  charactersURL.forEach(character => {
    fetch(character)
      .then(response => response.json())
      .then(data => {
        printCharacters(data);
      })
  })
}


const printCharacters = (character: Characters) => {
  const {charactersContainer} = myVariables;
    const characterCard = 
    `<div class="card characterCard" character-id="${character.id}" style="width: 18rem;">
    <img class="card-img-top" src="https://rickandmortyapi.com/api/character/avatar/${character.id}.jpeg" alt="Card image cap">
    <div class="card-body">
      <h5 class="card-title">${character.name}</h5>
      <span> ${character.species}  |  ${character.status}</span>
    </div>
    </div>`;
    charactersContainer.innerHTML += characterCard;
    displayCharacterInfo();
}


const displayCharacterInfo = (): void => {
  const cards = document.querySelectorAll('.characterCard') as NodeListOf<Element>;
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const characterId: number = Number(card.getAttribute(`character-id`));
      fetchCharacter(characterId);
    })
  })
}


const fetchCharacter = async (characterId: number): Promise<void> => {
 try{
  const {episodeContainer, characterContainer} = myVariables;
  const response = await fetch(`https://rickandmortyapi.com/api/character/${characterId}`);
  const character: Characters = await response.json();
  changeContainer(characterContainer, episodeContainer);
  printCharacterInfo(character);
 } catch(error) {
  console.log(error)
 }
}

const printCharacterInfo = (character: Characters):void => {
  const {characterImg, characterName, characterSpecifics, episodesOfCharacter} = myVariables;

  characterImg.src = character.image;
  characterName.textContent = character.name;
  characterSpecifics.textContent = `${character.species} | ${character.status} | ${character.gender} | ${character.origin.name}`

  character.episode.forEach(episode => {
    const episodeCharacterAppears = document.createElement('span');
    episodeCharacterAppears.textContent = `Episode ${episode.slice(40)}`;
    episodesOfCharacter.appendChild(episodeCharacterAppears);
  })
}


const changeContainer = (showingContainer: HTMLDivElement, hidingContainer: HTMLDivElement): void => {
  hidingContainer.classList.add('hidden');
  showingContainer.classList.remove('hidden');
}


fetchData()
  .then(episodes => createSeasons(episodes))
  .then(seasons => displaySeasons(seasons))
