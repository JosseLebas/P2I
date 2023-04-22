import {
  getPilote,
  getTeams,
  getUsers,
  modifyUser,
  getCircuits,
  piloteMissions,
  teamMissions,
} from "./localeStorage";

// Fonction qui détermine le contenu aléatoire des paquets
export const openPack = async (setPackRewards, setUser) => {
  const pilots = await getPilote();
  const teams = await getTeams();
  const user = await getUsers();

  if (user == null) {
    return null;
  }

  //Liste des pilotes présents dans le paquet
  const randomPilots = [];
  //Liste des équipes présentes dans le paquet
  const randomTeams = [];

  //Récupération de 4 pilotes aléatoires
  while (randomPilots.length < 4) {
    //Obtenir 4 pilotes différents dans le paquet
    const randomId = Math.floor(Math.random() * pilots.length);
    const element = pilots[randomId];
    //Pour éviter les doublons
    if (!randomPilots.includes(element)) {
      randomPilots.push(element);
      user.collectionPilote[randomId].copies += 1;
    }
  }

  //Récupération de 2 équipes aléatoires
  while (randomTeams.length < 2) {
    //Obtenir 2 teams différentes dans le paquet
    const randomId = Math.floor(Math.random() * teams.length);
    const element = teams[randomId];
    //Pour éviter les doublons
    if (!randomTeams.includes(element)) {
      randomTeams.push(element);
      user.collectionTeam[randomId].copies += 1;
    }
  }
  //Montant de pièces aléatoires entre 5à et 100
  const money = Math.floor(Math.random() * 51) + 50;
  user.money += money;
  //On enlève le paquet qui vient d'être ouvert
  user.packs -= 1;
  //Actualisation de l'utilisateur avec les nouvelles données
  setUser(user);
  await modifyUser(user);
  //Données présentes dans le paquet qui seront affichées lors de l'ouverture du paquet
  setPackRewards({
    pilots: randomPilots,
    teams: randomTeams,
    money: money,
  });
};

//détermination du nombre de paquet pour un grand prix donné
const rewardsForATrack = (user, tracks, trackId) => {
  if (user != null) {
    //On donne 10 points seulement pour la participation
    let packs = 0;
    let points = 10;
    //Vérification du premier choix de l'utilisateur sur ce Grand Prix, s'il est réussi on ajoute un paquet et les points correspondant
    if (
      user.choices[trackId].secondChoice != null &&
      piloteMissions[tracks[trackId].pilotMissionId[0] - 1].validation(
        parseInt(tracks[trackId].round),
        user.choices[trackId].secondChoice.id
      )
    ) {
      packs += 1;
      //Des points sont ajoutés selon le niveau de carte joué par l'utilisateur
      points +=
        piloteMissions[tracks[trackId].pilotMissionId[0] - 1].points +
        10 * (user.choices[trackId].secondChoice.level - 1);
    }
    //Deuxième choix
    if (
      user.choices[trackId].thirdChoice != null &&
      piloteMissions[tracks[trackId].pilotMissionId[1] - 1].validation(
        parseInt(tracks[trackId].round),
        user.choices[trackId].thirdChoice.id
      )
    ) {
      packs += 1;
      points +=
        piloteMissions[tracks[trackId].pilotMissionId[1] - 1].points +
        10 * (user.choices[trackId].thirdChoice.level - 1);
    }
    //Troisème choix
    if (
      user.choices[trackId].firstChoice != null &&
      teamMissions[tracks[trackId].teamMissionId - 1].validation(
        parseInt(tracks[trackId].round),
        user.choices[trackId].firstChoice.id
      )
    ) {
      packs += 1;
      points +=
        teamMissions[tracks[trackId].teamMissionId - 1].points +
        10 * (user.choices[trackId].firstChoice.level - 1);
    }
    //ajout dans ls informations de l'utilisateur
    user.choices[trackId].rewards = packs + 2;
    //On indique que les récompenses ont été données pour ne pas les redonner
    user.choices[trackId].given = true;
    user.points += points;
    return user;
  }
};

// Dons des récompenses des grands prix passés
export const giveRewards = async () => {
  const date = new Date();
  //Objectif: vérifier que toutes les récompenses des circuits passés ont été données
  const user = await getUsers();
  const tracks = await getCircuits();
  if (user == null) {
    return null;
  }
  for (let i = 0; i < user.choices.length; i++) {
    //Si la récompense d'un grand prix n'a pas été donnée
    if (!user.choices[i].given) {
      //Vérifier que le grand Prix s'est déjà déroulé (on ajoute un jour pour être sûr que les résultats soient enregistrés)
      if (
        new Date(new Date(tracks[i].date[0]).getTime() + 24 * 60 * 60 * 1000) <
        date
      ) {
        //Actualisation de l'utilisateur
        const useer = await rewardsForATrack(user, tracks, i);
        await modifyUser(useer);
      }
    }
  }
};
