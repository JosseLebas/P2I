import xml2js from "react-native-xml2js";

const rootEndpoint = "http://ergast.com/api/f1/current";

// Model class for a cocktail
export class Circuit {
  constructor(round, season, date, name) {
    this.round = round;
    this.season = season;
    this.date = date;
    this.name = name;
  }
}

class CircuitService {
  async searchCircuit(name) {
    const circuit = await this.fetchFromApi(`${rootEndpoint}/${name}`);
    return this.createCircuit(circuit);
  }

  async searchCircuits() {
    const circuits = await this.fetchFromApi(`${rootEndpoint}`);
    return this.createCircuits(circuits);
  }

  async fetchFromApi(query) {
    //message pour vérifier si l'URL est correcte
    console.log(`Fetching API with query ${query}`);
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
          resolve(result.MRData.RaceTable[0].Race);
        }
      });
    });
  }

  // Create a Cocktail model object from a subset of data fields returned by API
  createCircuit(circuit) {
    return new Circuit(
      circuit.$.round,
      circuit.$.season,
      circuit.Date,
      circuit.RaceName
    );
  }

  // Create a Cocktail model object list from the array returned by API
  createCircuits(circuits) {
    // Create a cocktail object for each element in the array
    return circuits.map((circuit) => this.createCircuit(circuit));
  }
}

export default new CircuitService();
