export const myVariables = {
  episodeNameContainer: document.querySelector('#episodeName')  as HTMLHeadingElement,
  airDateandEpisodeContainer: document.querySelector('#airDateAndEpisode') as HTMLSpanElement,
  seasonButtons: document.querySelectorAll('[data-number="seasonBtn"]')as NodeListOf<Element>,
  seasonContainers: document.querySelectorAll('.episodeContainer') as NodeListOf<Element>,
  charactersContainer: document.querySelector('.charactersContainer') as HTMLDivElement,
  episodeContainer: document.querySelector('#episodesDisplayer') as HTMLDivElement,
  characterContainer: document.querySelector('#characterDisplayer') as HTMLDivElement,
  characterImg: document.querySelector('#characterImg') as HTMLImageElement,
  characterName: document.querySelector('#characterName') as HTMLHeadingElement,
  characterSpecifics: document.querySelector('#characterSpecifics') as HTMLSpanElement,
  episodesOfCharacter: document.querySelector('#episodesOfCharacter') as HTMLDivElement,
  characterOrigin: document.querySelector('#characterOrigin') as HTMLSpanElement,
  originDisplayer: document.querySelector('#originDisplayer') as HTMLDivElement,
  planetName: document.querySelector('#planetName') as HTMLHeadingElement,
  originSpecifics: document.querySelector('#originSpecifics') as HTMLSpanElement,
  residentsContainer: document.querySelector('#residentsContainer') as HTMLDivElement
};