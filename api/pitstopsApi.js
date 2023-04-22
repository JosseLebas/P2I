import xml2js from "react-native-xml2js";
import { getTeamByDriverId } from "../utils/localeStorage";

const rootEndpoint = "https://ergast.com/api/f1/current/last/pitstops";

// Objet Pitstops
export class Pitstops {
  constructor(driverId, duration, lap, stop) {
    this.driverId = driverId;
    this.duration = duration;
    this.lap = lap;
    this.stop = stop;
  }
}

class PitstopsService {
  //Recherche d'un pitStop en particulier
  async searchResultsByStop(stop) {
    const result = await this.fetchFromApi(`${rootEndpoint}/${stop}`);
    return this.createPitstops(result);
  }

  //Recherche des pitstops d'un grand Prix donné
  async searchPitstopsByRound(round) {
    const result = await this.fetchFromApi(
      `https://ergast.com/api/f1/current/${round}/pitstops`
    );
    return this.createMultiplePitstops(result);
  }

  //Recherche de tous les pitstops
  async searchPitstops() {
    const results = await this.fetchFromApi(`${rootEndpoint}`);
    return this.createMultiplePitstops(results);
  }

  //Recherche des pitstops d'un pilote en fonction d'un Grand Prix
  async searchPitstopsByRoundAndPilotId(round, pilotId) {
    const results = await this.searchPitstopsByRound(round);
    for (let i = 0; i < results.length; i++) {
      if (results[i].driverId == pilotId) {
        return results[i];
      }
    }
  }

  // Recherche des pitstops d'une écurie en fonction d'un Grand Prix donné
  async searchPitstopsByRoundAndConstructorId(round, constructorId) {
    const results = await this.searchPitstopsByRound(round);
    const pitstops = [];
    for (let i = 0; i < results.length; i++) {
      const team = await getTeamByDriverId(results[i].driverId);
      if (team.id == constructorId) {
        pitstops.push(results[i]);
      }
    }
    return pitstops;
  }

  //Exploitation des résultats de l'api
  async fetchFromApi(query) {
    //message pour vérifier si l'URL est correcte
    console.log(`Fetching API pour obtenir les résultats ${query}`);
    //récupération des données au format XML
    const response = await fetch(query);
    //Changement en format texte
    const data = await response.text();
    return new Promise((resolve, reject) => {
      xml2js.parseString(data, (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(result.MRData.RaceTable[0].Race[0].PitStopsList[0].PitStop);
        }
      });
    });
  }

  // Création de l'objet Pitstops à partir des résultats de l'api
  createPitstops(result) {
    return new Pitstops(
      result.$.driverId,
      result.$.duration,
      result.$.lap,
      result.$.stop
    );
  }

  // Création de tous les pitstops passés en paramètre
  createMultiplePitstops(results) {
    // Create a cocktail object for each element in the array
    return results.map((result) => this.createPitstops(result));
  }
}

export default new PitstopsService();
