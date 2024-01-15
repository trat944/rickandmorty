import {MainInterface, Info, Episode, Seasons} from "./interfaces/index"

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
  console.log(seasons)
  return seasons;
}

const displaySeasons = (seasons: Seasons) : void => {
  const seasonButtons = document.querySelectorAll('[data-number="seasonBtn"]')as NodeListOf<Element>;
  seasonButtons.forEach(button => {
    const seasonNumber: number = Number(button.classList.value);
    button.addEventListener('click', () => {
      const containers = document.querySelectorAll('.episodeContainer') as NodeListOf<Element>;
      containers.forEach(container => {
        container.textContent = "";
      })
      printSeason(seasons, seasonNumber);
    })
  })
}

const printSeason = (seasons: Seasons, seasonNumber: number) : void => {
  const {season1, season2, season3, season4, season5} = seasons;
 
  const seasonArray: Episode[][] = [season1, season2, season3, season4, season5];
  const selectedSeason = seasonArray[seasonNumber - 1];

  selectedSeason.forEach(episode => {
    const container = document.querySelector(`.container_${seasonNumber}`) as HTMLDivElement;
    const episodePrinted = document.createElement('p') as HTMLParagraphElement;
    episodePrinted.textContent = `Episode ${episode.episode.slice(4)}`;
    container.appendChild(episodePrinted);
  })
}


fetchData()
  .then(episodes => createSeasons(episodes))
  .then(seasons => displaySeasons(seasons))
