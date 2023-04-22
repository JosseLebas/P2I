import xml2js from "react-native-xml2js";
import { getPilotesByConstructorId } from "../utils/localeStorage";

const rootEndpoint = "https://ergast.com/api/f1/current/constructors";

// Model class for a cocktail
export class Team {
  constructor(id, name, nationality, pilots) {
    this.id = id;
    this.name = name;
    this.nationality = nationality;
    this.pilots = pilots;
  }
}

class TeamService {
  async searchTeams() {
    const teams = await this.fetchFromApi(`${rootEndpoint}`);
    return this.createTeams(teams);
  }

  async fetchFromApi(query) {
    //message pour vérifier si l'URL est correcte
    console.log(`Fetching API pour obtenir les équipes ${query}`);
    //récupération des données au format XML
    const response = await fetch(query);
    //Changement en format texte
    const data = await response.text();
    return new Promise((resolve, reject) => {
      xml2js.parseString(data, async (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          const table = result.MRData.ConstructorTable[0].Constructor;
          for (let i = 0; i < table.length; i++) {
            const resultat = await getPilotesByConstructorId(
              table[i].$.constructorId
            );
            table[i].Pilots = [resultat[0].id, resultat[1].id];
          }
          resolve(table);
        }
      });
    });
  }

  // Create a Cocktail model object from a subset of data fields returned by API
  createTeam(result) {
    return new Team(
      result.$.constructorId,
      result.Name,
      result.Nationality,
      result.Pilots
    );
  }

  // Create a Cocktail model object list from the array returned by API
  createTeams(teams) {
    // Create a cocktail object for each element in the array
    return teams.map((team) => this.createTeam(team));
  }
}

export default new TeamService();
