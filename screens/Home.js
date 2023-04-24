import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View, Modal, TouchableOpacity, ScrollView } from "react-native";
import TimeLeft from "../components/TimeLeft";
import Card from "../components/Card";
import Carrousel from "../components/Carrousel";
import PiloteCard from "../components/PiloteCard";
import TeamCard from "../components/TeamCard";
import {
  getCircuits,
  getUsers,
  teamMissions,
  piloteMissions,
  modifyUser,
  getCircuitById,
} from "../utils/localeStorage";
import { giveRewards } from "../utils/functions";
import MissionPopup from "../components/MissionPopup";
import styles from "../theme/styles";

const Home = ({ navigation, route }) => {
  //Variable contenant la collection de pilotes de l'utilisateur
  const [pilotes, setPilotes] = useState(null);
  //Variable contenant la collection de teams de l'utilisateur
  const [teams, setTeams] = useState(null);
  //Variable contenant le Grand Prix qui va être affiché sur la page
  const [GP, setGP] = useState(getCircuits()[0]);
  //Variable indiquant si la popup de choix de pilotes ou d'équipes doit s'afficher
  const [modalVisible, setModalVisible] = useState(false);
  //Variable indiquant si la popup d'informations des missions doit s'afficher'
  const [modalInfosVisible, setModalInfosVisible] = useState(false);
  //Variable contenant les choix de piltotes et d'équipes de l'utilisateur
  const [choices, setChoices] = useState(null);
  //Indique quel choix l'utilisateur souhaite modifier
  const [currentChoice, setCurrentChoice] = useState(1);
  //Indique si l'application est en cours de chargement ou non (en chargement lors de la récupération des données de l'api)
  const [isLoading, setIsLoading] = useState(true);
  //Contient les informations de l'utilisateur
  const [user, setUser] = useState(null);
  //Variable indiquant si la popup de récupération de récompenses doit s'afficher ou non
  const [modalRewardsVisible, setModalRewardsVisible] = useState(false);
  //Récupération des données de navigation (le round du grand prix que l'on souhaite afficher et si c'est le prochain GP ou non)
  const { round, isNextGP } = route.params || {
    round: 1,
    isNextGP: true,
  };

  //Récupération de toutes les données à l'ouverture de la page
  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        const users = await getUsers();
        // Si l'utilisateur ouvre l'application pour la première fois, il n'aura aucune donnée. Si c'est le cas il sera renvoyé vers la page de Connexion
        async function verifConnexion() {
          await giveRewards();
          //const users = null;
          if (users == null) {
            navigation.navigate("Connexion");
          }
        }
        verifConnexion();

        //Récupération des données
        if (users != null) {
          setUser(users);
          setPilotes(users.collectionPilote);
          setTeams(users.collectionTeam);
          setChoices(users.choices);
          setIsLoading(false);
        }
      }

      fetchData();

      // fonction de nettoyage
      return () => {
        // code à exécuter lorsque l'écran est en cours de suppression de la pile de navigation
      };
    }, [])
  );

  //Actualisation du Grand Prix lorsque la variable round est changée. L'affichage de la page change donc en conséquence
  useEffect(() => {
    async function updateGP() {
      const gp = await getCircuitById(round);
      setGP(gp);
    }
    updateGP();
  }, [round]);

  //Dés qu'une modification est faite sur l'utilisateur, il faut le modifier dans la BDD
  useEffect(() => {
    modifyUser(user);
  }, [user]);

  //Enregistrement des choix de l'utilisateur
  async function changeChoice(choice, newChoice) {
    const updatedChoices = [...choices];
    if (choice == 1) {
      updatedChoices[GP.round - 1].firstChoice = newChoice;
    } else if (choice == 2) {
      updatedChoices[GP.round - 1].secondChoice = newChoice;
    } else {
      updatedChoices[GP.round - 1].thirdChoice = newChoice;
    }
    user.choices = updatedChoices;
    //Actualisation des données
    modifyUser(user);
    setModalVisible(false);
    setChoices(updatedChoices);
  }

  //Affichage de la popup qui permet de choisir les équipes
  function showTeams() {
    return (
      <ScrollView style={{ marginLeft: 12, width: "100%", height: "100%" }}>
        <View style={styles.collection}>
          {teams.map((item) => {
            return (
              <TouchableOpacity
                onPress={async () => await changeChoice(1, item)}
                key={item.id}
              >
                <TeamCard
                  name={item.name[0]}
                  level={item.level}
                  pilots={item.pilots}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  //Affichage de la popup qui permet de choisir les pilotes
  function showPilots(choice) {
    return (
      <ScrollView style={{ marginLeft: 12, width: "100%" }}>
        <View style={styles.collection}>
          {pilotes.map((item) => {
            return (
              <TouchableOpacity
                onPress={async () => await changeChoice(choice, item)}
                key={item.id}
              >
                <PiloteCard
                  nationality={item.nationality[0]}
                  number={item.number[0]}
                  level={item.level}
                  name={item.familyName[0]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  //Affichage de la popup pour les choix, en fonction de quelle carte l'utilisateur souhaite modifier
  function showPopup() {
    if (currentChoice == 1) {
      return showTeams();
    } else {
      if (currentChoice == 2) {
        return showPilots(2);
      }
      return showPilots(3);
    }
  }

  //Actualisation des récompenses dans la BDD
  function recupRewards() {
    const updateUser = user;
    updateUser.packs += choices[round - 1].rewards;
    setUser(updateUser);
    choices[round - 1].claimed = true;
    setModalRewardsVisible(false);
    modifyUser(user);
  }

  return isLoading ? (
    // Dans le cas où les données ne sont pas encore toutes récupérées
    <View>
      <Text>Chargement</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Carrousel navigation={navigation} />
      {
        //Carte d'équipe
      }
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {isNextGP ? "Prochain grand prix : " : null}
        {GP != null ? GP.name : null}
      </Text>
      <View style={styles.viewCard}>
        <Card
          setModalInfosVisible={setModalInfosVisible}
          condition={GP != null ? teamMissions[GP.teamMissionId - 1].name : ""}
          bonus1={
            //Vérification que les données de choix existent
            choices
              ? //Vérification que des choix aient bien été faits
                GP != null && choices[GP.round - 1].firstChoice
                ? //Vérification du niveau de la carte pour adapter l'affichage
                  choices[GP.round - 1].firstChoice.level >= 2
                  ? 3
                  : 2
                : 1
              : 1
          }
          bonus2={
            choices
              ? GP != null && choices[GP.round - 1].firstChoice
                ? choices[GP.round - 1].firstChoice.level >= 3
                  ? 3
                  : 2
                : 1
              : 1
          }
          bonus3={
            choices
              ? GP != null && choices[GP.round - 1].firstChoice
                ? choices[GP.round - 1].firstChoice.level >= 4
                  ? 3
                  : 2
                : 1
              : 1
          }
          pointsCondition={
            GP != null ? teamMissions[GP.teamMissionId - 1].points : ""
          }
          image={
            //Adaptation de l'image en fonction des choix qui sont faits
            GP
              ? choices
                ? GP != null && choices[GP.round - 1].firstChoice
                  ? "https://media.formula1.com/content/dam/fom-website/teams/2023/" +
                    choices[GP.round - 1].firstChoice.name[0]
                      .toLowerCase()
                      .replace(" ", "-") +
                    "-logo.png.transform/2col/image.png"
                  : require("../assets/team.png")
                : null
              : null
          }
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setCurrentChoice={setCurrentChoice}
          choice={1}
          isNextGP={isNextGP}
        />
      </View>
      {
        //Carte de pilote 1
      }
      <View style={styles.viewCard}>
        <Card
          setModalInfosVisible={setModalInfosVisible}
          condition={
            GP != null ? piloteMissions[GP.pilotMissionId[0] - 1].name : ""
          }
          bonus1={
            choices
              ? GP != null && choices[GP.round - 1].secondChoice
                ? choices[GP.round - 1].secondChoice.level >= 2
                  ? 3
                  : 2
                : 1
              : 1
          }
          bonus2={
            choices
              ? GP != null && choices[GP.round - 1].secondChoice
                ? choices[GP.round - 1].secondChoice.level >= 3
                  ? 3
                  : 2
                : 1
              : 1
          }
          bonus3={
            choices
              ? GP != null && choices[GP.round - 1].secondChoice
                ? choices[GP.round - 1].secondChoice.level >= 4
                  ? 3
                  : 2
                : 1
              : 1
          }
          pointsCondition={
            GP != null ? piloteMissions[GP.pilotMissionId[0] - 1].points : ""
          }
          image={
            GP
              ? choices
                ? GP != null && choices[GP.round - 1].secondChoice
                  ? "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/" +
                    choices[GP.round - 1].secondChoice.familyName[0]
                      .toLowerCase()
                      .replace(" ", "") +
                    ".jpg.img.1920.medium.jpg/1677069773437.jpg"
                  : require("../assets/Casque.png")
                : null
              : null
          }
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setCurrentChoice={setCurrentChoice}
          choice={2}
          isNextGP={isNextGP}
        />
        {
          //Carte de pilote 2
        }
        <Card
          setModalInfosVisible={setModalInfosVisible}
          condition={
            GP != null ? piloteMissions[GP.pilotMissionId[1] - 1].name : ""
          }
          bonus1={
            choices
              ? GP != null && choices[GP.round - 1].thirdChoice
                ? choices[GP.round - 1].thirdChoice.level >= 2
                  ? 3
                  : 2
                : 1
              : 1
          }
          bonus2={
            choices
              ? GP != null && choices[GP.round - 1].thirdChoice
                ? choices[GP.round - 1].thirdChoice.level >= 3
                  ? 3
                  : 2
                : 1
              : 1
          }
          bonus3={
            choices
              ? GP != null && choices[GP.round - 1].thirdChoice
                ? choices[GP.round - 1].thirdChoice.level >= 4
                  ? 3
                  : 2
                : 1
              : 1
          }
          pointsCondition={
            GP != null ? piloteMissions[GP.pilotMissionId[1] - 1].points : ""
          }
          image={
            GP
              ? choices
                ? GP != null && choices[GP.round - 1].thirdChoice
                  ? "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/" +
                    choices[GP.round - 1].thirdChoice.familyName[0]
                      .toLowerCase()
                      .replace(" ", "") +
                    ".jpg.img.1920.medium.jpg/1677069773437.jpg"
                  : require("../assets/Casque.png")
                : null
              : null
          }
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setCurrentChoice={setCurrentChoice}
          choice={3}
          isNextGP={isNextGP}
        />
      </View>
      {
        //Dans le cas où la page d'accueil affiche le prochain grand prix, on affiche le temps qui reste avant son début
      }
      {
        //Sinon on fait afficher les récompenses si elles sont disponibles
      }
      {isNextGP ? (
        <TimeLeft />
      ) : choices ? (
        <TouchableOpacity
          onPress={() =>
            choices[round - 1].given && !choices[round - 1].claimed
              ? setModalRewardsVisible(true)
              : null
          }
          style={styles.rewardsButton}
        >
          <Text style={styles.rewardsText}>Récupérer récompenses</Text>
          {choices[round - 1].given && !choices[round - 1].claimed ? (
            //Notification dans le cas où l'utilisateur possède au moins un paquet
            <View style={styles.notificationRewards}>
              <Text style={styles.notificationRewardsText}>!</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      ) : null}

      {
        //Popup des choix d'équipes ou des pilotes
      }
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        transparent={true}
      >
        <View style={styles.popupBackground}>
          <TouchableOpacity
            style={styles.backgroundOverlay}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.popupContainer}>
            <Text style={styles.popupTitle}>
              {currentChoice == 1
                ? "Choisissez une écurie"
                : "Choisissez un pilote"}
            </Text>
            {pilotes && teams ? showPopup() : ""}
          </View>
        </View>
      </Modal>

      {
        //Popup pour récupérer les récompenses
      }
      <Modal
        visible={modalRewardsVisible}
        animationType="slide"
        onRequestClose={() => setModalRewardsVisible(false)}
        transparent={true}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <TouchableOpacity
            style={styles.backgroundOverlay}
            onPress={() => setModalRewardsVisible(false)}
          />
          <TouchableOpacity
            onPress={() => recupRewards()}
            style={styles.popupRewardsContainer}
          >
            <Text style={styles.popupRewardsText}>
              Vous avez obtenu {choices ? choices[round - 1].rewards : "/"}{" "}
              paquets
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <MissionPopup
        missionTitle={
          GP != null
            ? currentChoice == 1
              ? teamMissions[GP.teamMissionId - 1].name
              : piloteMissions[GP.pilotMissionId[currentChoice - 2] - 1].name
            : null
        }
        missionDescription={
          GP != null
            ? currentChoice == 1
              ? teamMissions[GP.teamMissionId - 1].description
              : piloteMissions[GP.pilotMissionId[currentChoice - 2] - 1]
                  .description
            : null
        }
        setModalInfosVisible={setModalInfosVisible}
        modalInfosVisible={modalInfosVisible}
        points={
          GP != null
            ? currentChoice == 1
              ? teamMissions[GP.teamMissionId - 1].points
              : piloteMissions[GP.pilotMissionId[currentChoice - 2] - 1].points
            : null
        }
      />
    </View>
  );
};

export default Home;
