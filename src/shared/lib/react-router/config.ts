export const pathKeys = {
  root: '/',
  home() {
    return pathKeys.root
  },
  dashboard() {
    return pathKeys.root + 'dashboard';
  },
  players: {
    root() {
      return pathKeys.root + 'player/list/';
    },

    bySlug(id: string) {  
      return pathKeys.players.root() + id;  
    },
  },
  teams: {
    root() {
      return pathKeys.root.concat('teams/')
    },
    bySlug(slug: string) {
      return pathKeys.teams.root().concat(`${slug}`);
    },
  },
  matches: {
    root() {
      return pathKeys.root.concat('matches/')
    },
    bySlug(slug: string) {
      return pathKeys.matches.root().concat(`${slug}`);
    },
  },
  tournaments: {
    root() {
      return pathKeys.root.concat('tournaments/')
    },
    bySlug(slug: string) {
      return pathKeys.tournaments.root().concat(`${slug}`);
    },  },
  error() {
    return pathKeys.root.concat('*')
  },
}
