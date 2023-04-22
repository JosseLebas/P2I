import xml2js from "react-native-xml2js";

const rootEndpoint = "https://ergast.com/api/f1/current/last/results";

// Création de l'objet Pilote selon les informations qui nous seront utiles
export class Pilote {
  constructor(id, familyName, givenName, number, nationality, constructorId) {
    this.id = id;
    this.familyName = familyName;
    this.givenName = givenName;
    this.number = number;
    this.nationality = nationality;
    this.constructorId = constructorId;
  }
}

class PiloteService {
  //Recherche de tous les pilotes de l'api
  async searchPilotes() {
    const pilotes = await this.fetchFromApi(`${rootEndpoint}`);
    return this.createPilotes(pilotes);
  }

  //Fonction pour exploiter l'url
  async fetchFromApi(query) {
    //message pour vérifier si l'URL est correcte
    console.log(`Fetching API pour obtenir des pilotes ${query}`);
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

  // Création d'un pilote selon les résultats renvoyés par l'api
  createPilote(result) {
    return new Pilote(
      result.Driver[0].$.driverId,
      result.Driver[0].FamilyName,
      result.Driver[0].GivenName,
      result.Driver[0].PermanentNumber,
      result.Driver[0].Nationality,
      result.Constructor[0].$.constructorId
    );
  }

  // Création de tous les pilotes mis en paramètres venant de l'api
  createPilotes(pilotes) {
    // Create a cocktail object for each element in the array
    return pilotes.map((pilote) => this.createPilote(pilote));
  }
}

export default new PiloteService();
