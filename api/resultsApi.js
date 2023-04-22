import xml2js from "react-native-xml2js";

const rootEndpoint = "https://ergast.com/api/f1/current/last/results";

// Model class for a cocktail
export class Result {
  constructor(id, position, driver, constructor, fastestLap, grid, status) {
    this.id = id;
    this.position = position;
    this.driver = driver;
    this.constructor = constructor;
    this.fastestLap = fastestLap;
    this.grid = grid;
    this.status = status;
  }
}

class ResultService {
  async searchResultsByPosition(position) {
    const result = await this.fetchFromApi(`${rootEndpoint}/${position}`);
    return this.createResult(result);
  }

  async searchResultsByRound(round) {
    const result = await this.fetchFromApi(
      `https://ergast.com/api/f1/current/${round}/results`
    );
    return this.createResults(result);
  }

  async searchResults() {
    const results = await this.fetchFromApi(`${rootEndpoint}`);
    return this.createResults(results);
  }

  async searchResultsByRoundAndConstructorId(round, constructorId) {
    const results = await this.searchResultsByRound(round);
    const resultsTeam = [];
    for (let i = 0; i < results.length; i++) {
      if (results[i].constructor[0].$.constructorId == constructorId) {
        resultsTeam.push(results[i]);
      }
    }
    return resultsTeam;
  }

  async searchResultsByRoundAndPilotId(round, pilotId) {
    const results = await this.searchResultsByRound(round);
    for (let i = 0; i < results.length; i++) {
      if (results[i].driver[0].$.driverId == pilotId) {
        return results[i];
      }
    }
  }

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
          resolve(result.MRData.RaceTable[0].Race[0].ResultsList[0].Result);
        }
      });
    });
  }

  // Create a Cocktail model object from a subset of data fields returned by API
  createResult(result) {
    return new Result(
      result.$.number,
      result.$.position,
      result.Driver,
      result.Constructor,
      result.FastestLap,
      result.Grid,
      result.Status
    );
  }

  // Create a Cocktail model object list from the array returned by API
  createResults(results) {
    // Create a cocktail object for each element in the array
    return results.map((result) => this.createResult(result));
  }
}

export default new ResultService();
