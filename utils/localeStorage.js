import AsyncStorage from "@react-native-async-storage/async-storage";
import PiloteService from "../api/piloteApi";
import CircuitService from "../api/trackApi";
import TeamService from "../api/teamApi";
import ResultService from "../api/resultsApi";
import PitstopsService from "../api/pitstopsApi";

// AsyncStorage key used for storing ideas
const USER_KEY = "ASYNC_STORAGE_USER";
const PILOTE_KEY = "ASYNC_STORAGE_PILOTE";
const CIRCUIT_KEY = "ASYNC_STORAGE_CIRCUIT";
const TEAM_KEY = "ASYNC_STORAGE_TEAM";
const TEAM_MISSION_KEY = "ASYNC_STORAGE_TEAM_MISSION";
const PILOTE_MISSION_KEY = "ASYNC_STORAGE_PILOTE_MISSION";

export const required = [
  { price: 100, copies: 3 },
  { price: 200, copies: 6 },
  { price: 400, copies: 10 },
];

//Données inventées
export const teamMissions = [
  {
    id: 1,
    name: "Indestructible",
    points: 20,
    description: "Tous les pilotes de l'écurie terminent la course",
    validation: async (round, idConstructor) => {
      const results = await ResultService.searchResultsByRoundAndConstructorId(
        round,
        idConstructor
      );
      if (
        ((results[0].status[0]._ == "Finished") |
          results[0].status[0]._.includes("Lap")) &
        ((results[1].status[0]._ == "Finished") |
          results[1].status[0]._.includes("Lap"))
      ) {
        return true;
      }
      return false;
    },
  },
  {
    id: 2,
    name: "Tacticien",
    points: 50,
    description: "Les 2 pilotes de l'écurie font 5 pits stop ou moins",
    validation: async (round, constructorId) => {
      const result =
        await PitstopsService.searchPitstopsByRoundAndConstructorId(
          round,
          constructorId
        );
      return result.length <= 5;
    },
  },
  {
    id: 3,
    name: "Mauvaise perf",
    points: 35,
    description: "L'addition des positions des 2 pilotes est de 25 ou plus",
    validation: async (round, idConstructor) => {
      const results = await ResultService.searchResultsByRoundAndConstructorId(
        round,
        idConstructor
      );
      if (parseInt(results[0].position) + parseInt(results[1].position) >= 25) {
        return true;
      }
      return false;
    },
  },
  {
    id: 4,
    name: "Bon travail",
    points: 70,
    description:
      "La moyenne des pits stop de l'écurie est de 25 secondes ou moins",
    validation: async (round, constructorId) => {
      const results =
        await PitstopsService.searchPitstopsByRoundAndConstructorId(
          round,
          constructorId
        );
      let mean = 0;
      for (let i = 0; i < results.length; i++) {
        mean += parseFloat(results[i].duration);
      }
      mean /= results.length;
      if (mean <= 25) {
        return true;
      }
      return false;
    },
  },
];

export const piloteMissions = [
  {
    id: 1,
    name: "Vers la lumière",
    points: 50,
    description: "C'est le pilote ayant passé le plus de tours premier",
    validation: async (round, idPilot) => {
      const results = await ResultService.searchResultsByRound(round);
      return true;
    },
  },
  {
    id: 2,
    name: "Rapide et furieux",
    points: 50,
    description: "Le pilote termine 5ème ou moins",
    validation: async (round, idPilot) => {
      const results = await ResultService.searchResultsByRoundAndPilotId(
        round,
        idPilot
      );
      if (parseInt(results.position) <= 5) {
        return true;
      }
      return false;
    },
  },
  {
    id: 3,
    name: "Top chrono",
    points: 60,
    description: "Le pilote réalise le meilleur tour",
    validation: async (round, idPilot) => {
      const results = await ResultService.searchResultsByRoundAndPilotId(
        round,
        idPilot
      );
      if (parseInt(results.fastestLap[0].$.rank) == 1) {
        return true;
      }
      return false;
    },
  },
  {
    id: 4,
    name: "Bon départ",
    points: 40,
    description: "Le pilote termine premier des qualifications",
    validation: async (round, idPilot) => {
      const results = await ResultService.searchResultsByRoundAndPilotId(
        round,
        idPilot
      );
      if (parseInt(results.grid[0]) == 1) {
        return true;
      }
      return false;
    },
  },
  {
    id: 5,
    name: "Retour aux stands",
    points: 70,
    description: "Le pilote ne termine pas la course",
    validation: async (round, idPilot) => {
      const results = await ResultService.searchResultsByRoundAndPilotId(
        round,
        idPilot
      );
      if (
        (results.status[0]._ != "Finished") &
        !results.status[0]._.includes("Lap")
      ) {
        return true;
      }
      return false;
    },
  },
  {
    id: 6,
    name: "Dans le rétro",
    points: 20,
    description: "Le pilote est premier pendant 10 tours ou plus",
    validation: async (round, idPilot) => {
      return true;
    },
  },
];

//BDD Pilotes

export const storePilotes = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(PILOTE_KEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getPilote = async () => {
  try {
    const value = await AsyncStorage.getItem(PILOTE_KEY);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // Error reading value
  }
};

export const getPiloteById = async (id) => {
  try {
    const value = await getPilote();
    if (value !== null) {
      for (let i = 0; i < value.length; i++) {
        if (value[i].id == id) {
          return value[i];
        }
      }
    }
  } catch (e) {
    // Error reading value
  }
};

export const getPilotesByConstructorId = async (id) => {
  try {
    const value = await getPilote();
    const pilots = [];
    if (value !== null) {
      for (let i = 0; i < value.length; i++) {
        if (value[i].constructorId == id) {
          pilots.push(value[i]);
        }
      }
    }
    return pilots;
  } catch (e) {
    // Error reading value
  }
};

export const resetPilotes = async () => {
  try {
    await AsyncStorage.multiRemove([PILOTE_KEY]);
  } catch (e) {
    console.error("Failed to clear pilotes");
  }
};

export const fillPilotes = async () => {
  if (getPilote()) {
    try {
      response = await PiloteService.searchPilotes();
      storePilotes(response);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Les pilotes sont déjà enregistrés");
  }
};

//BDD Pilotes

export const storeTeams = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(TEAM_KEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getTeams = async () => {
  try {
    const value = await AsyncStorage.getItem(TEAM_KEY);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // Error reading value
  }
};

export const getTeamByDriverId = async (driverId) => {
  const teams = await getTeams();
  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams[i].pilots.length; j++) {
      if (teams[i].pilots[j] == driverId) {
        return teams[i];
      }
    }
  }
};

export const resetTeams = async () => {
  try {
    await AsyncStorage.multiRemove([TEAM_KEY]);
  } catch (e) {
    console.error("Failed to clear teams");
  }
};

export const fillTeams = async () => {
  if (getTeams()) {
    try {
      response = await TeamService.searchTeams();
      storeTeams(response);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Les teams sont déjà enregistrées");
  }
};

//BDD Circuits

export const storeCircuits = async (value) => {
  try {
    for (let i = 0; i < value.length; i++) {
      const randomPilotIndex1 = Math.floor(
        Math.random() * piloteMissions.length
      );
      const randomPilotMission1 = piloteMissions[randomPilotIndex1];
      const randomPilotIndex2 = Math.floor(
        Math.random() * piloteMissions.length
      );
      const randomPilotMission2 = piloteMissions[randomPilotIndex2];
      const randomTeamIndex = Math.floor(Math.random() * teamMissions.length);
      const randomTeamMission = teamMissions[randomTeamIndex];
      value[i].teamMissionId = randomTeamMission.id;
      value[i].pilotMissionId = [
        randomPilotMission1.id,
        randomPilotMission2.id,
      ];
    }
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(CIRCUIT_KEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getCircuits = async () => {
  try {
    const value = await AsyncStorage.getItem(CIRCUIT_KEY);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // Error reading value
  }
};

export const recupNextGP = async () => {
  const circuits = await getCircuits();
  if (circuits == null) {
    return null;
  }
  for (let i = 0; i < circuits.length; i++) {
    if (new Date() < new Date(circuits[i].date[0])) {
      return circuits[i];
    }
  }
};

export const getCircuitById = async (round) => {
  const circuits = await getCircuits();
  if (circuits == null) {
    return null;
  }
  for (let i = 0; i < circuits.length; i++) {
    if (circuits[i].round == round) {
      return circuits[i];
    }
  }
};

export const resetCircuits = async () => {
  try {
    await AsyncStorage.multiRemove([CIRCUIT_KEY]);
  } catch (e) {
    console.error("Failed to clear circuits");
  }
};

export const fillCircuits = async () => {
  if (getCircuits()) {
    try {
      response = await CircuitService.searchCircuits();
      for (let i = 0; i < response.length; i++) {
        response[i].name[0] = response[i].name[0].replace(/ Grand Prix/g, "");
      }
      storeCircuits(response);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Les circuits sont déjà enregistrés");
  }
};

//BDD Team Missions

export const storeTeamMissions = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(TEAM_MISSION_KEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getTeamMissions = async () => {
  try {
    const value = await AsyncStorage.getItem(TEAM_MISSION_KEY);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // Error reading value
  }
};

export const resetTeamMissions = async () => {
  try {
    await AsyncStorage.multiRemove([TEAM_MISSION_KEY]);
  } catch (e) {
    console.error("Failed to clear team missions");
  }
};

export const fillTeamMissions = async () => {
  if (getTeamMissions()) {
    storeTeamMissions(teamMissions);
  } else {
    console.log("Les missions d'équipe sont déjà enregistrées");
  }
};

//BDD Pilote Missions

export const storePiloteMissions = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(PILOTE_MISSION_KEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getPiloteMissions = async () => {
  try {
    const value = await AsyncStorage.getItem(PILOTE_MISSION_KEY);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // Error reading value
  }
};

export const resetPiloteMissions = async () => {
  try {
    await AsyncStorage.multiRemove([PILOTE_MISSION_KEY]);
  } catch (e) {
    console.error("Failed to clear pilote missions");
  }
};

export const fillPiloteMissions = async () => {
  if (getPiloteMissions()) {
    storePiloteMissions(piloteMissions);
  } else {
    console.log("Les missions des pilotes sont déjà enregistrées");
  }
};

//BDD User

export const storeUser = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.log(e);
  }
};

export const getUsers = async () => {
  try {
    const value = await AsyncStorage.getItem(USER_KEY);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    }
  } catch (e) {
    // Error reading value
  }
};

export const resetUsers = async () => {
  try {
    await AsyncStorage.multiRemove([USER_KEY]);
  } catch (e) {
    console.error("Failed to clear users");
  }
};

export const createUser = async (username, mdp) => {
  const pilotes = await getPilote();
  for (let i = 0; i < pilotes.length; i++) {
    pilotes[i].level = 1;
    pilotes[i].copies = 1;
  }
  const teams = await getTeams();
  for (let i = 0; i < teams.length; i++) {
    teams[i].level = 1;
    teams[i].copies = 1;
  }
  const circuits = await getCircuits();
  const userChoices = [];
  for (let i = 0; i < circuits.length; i++) {
    userChoices.push({
      round: circuits[i].round,
      firstChoice: null,
      secondChoice: null,
      thirdChoice: null,
      given: false,
      claimed: false,
      rewards: 0,
    });
  }
  const user = {
    name: username,
    password: mdp,
    money: 0,
    packs: 20,
    points: 0,
    collectionPilote: pilotes,
    collectionTeam: teams,
    choices: userChoices,
  };
  await storeUser(user);
};

export const createUserTest = async () => {
  //Création de sa collection de pilotes
  const pilotes = await getPilote();
  for (let i = 0; i < pilotes.length; i++) {
    pilotes[i].level = 1;
    pilotes[i].copies = 1;
  }
  //Création artificielle d'une collection entamée
  pilotes[2].level = 3;
  pilotes[2].copies = 3;
  pilotes[5].level = 2;
  pilotes[10].level = 2;
  pilotes[12].level = 2;
  pilotes[7].level = 2;
  pilotes[8].level = 2;
  pilotes[5].copies = 3;
  pilotes[10].copies = 6;
  pilotes[12].copies = 1;
  pilotes[7].copies = 0;
  pilotes[8].copies = 0;
  //Création de la collection d'écuries
  const teams = await getTeams();
  for (let i = 0; i < teams.length; i++) {
    teams[i].level = 1;
    teams[i].copies = 1;
  }
  teams[4].level = 3;
  teams[4].copies = 0;
  teams[5].level = 2;
  teams[1].level = 2;
  teams[3].level = 2;
  teams[2].level = 2;
  teams[8].level = 2;
  teams[5].copies = 3;
  teams[1].copies = 6;
  teams[3].copies = 1;
  teams[2].copies = 0;
  teams[8].copies = 0;
  //Création de tous les choix de l'utilisateur qui sont tous initialisés à null au début
  const circuits = await getCircuits();
  const userChoices = [];
  for (let i = 0; i < circuits.length; i++) {
    userChoices.push({
      round: circuits[i].round,
      firstChoice: null,
      secondChoice: null,
      thirdChoice: null,
      given: false,
      claimed: false,
      rewards: 0,
    });
  }
  //Création de choix artificiels
  userChoices[0].firstChoice = teams[1];
  userChoices[0].secondChoice = pilotes[3];
  userChoices[0].thirdChoice = pilotes[1];
  userChoices[1].firstChoice = teams[9];
  userChoices[1].secondChoice = pilotes[17];
  userChoices[1].thirdChoice = pilotes[12];
  userChoices[2].firstChoice = teams[4];
  userChoices[2].secondChoice = pilotes[13];
  userChoices[2].thirdChoice = pilotes[9];
  //Création de l'utilisateur avec les paramètres choisis
  const user = {
    name: "UserTest",
    password: "password",
    money: 127,
    packs: 3,
    points: 0,
    collectionPilote: pilotes,
    collectionTeam: teams,
    choices: userChoices,
  };
  await storeUser(user);
};

export const modifyUser = async (value) => {
  resetUsers().then(storeUser(value));
};
