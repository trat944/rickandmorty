export interface MainInterface {
  info:    Info;
  results: Episode[];
}

export interface Info {
  count: number;
  pages: number;
  next:  string;
  prev:  null;
}

export interface Episode {
  id:         number;
  name:       string;
  air_date:   string;
  episode:    string;
  characters: string[];
  url?:        string;
  created?:    string;
}

export interface Seasons {
  season1: Episode[];
  season2: Episode[];
  season3: Episode[];
  season4: Episode[];
  season5: Episode[];
}
