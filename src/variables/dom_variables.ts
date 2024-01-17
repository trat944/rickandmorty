export const myVariables = {
  episodeNameContainer: document.querySelector('#episodeName')  as HTMLHeadingElement,
  airDateandEpisodeContainer: document.querySelector('#airDateAndEpisode') as HTMLSpanElement,
  seasonButtons: document.querySelectorAll('[data-number="seasonBtn"]')as NodeListOf<Element>,
  containers: document.querySelectorAll('.episodeContainer') as NodeListOf<Element>,
  charactersContainer: document.querySelector('.charactersContainer') as HTMLDivElement
};