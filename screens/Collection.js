import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
} from "react-native";
import styles, { collection } from "../theme/styles";
import Carrousel from "../components/Carrousel";
import PiloteCard from "../components/PiloteCard";
import TeamCard from "../components/TeamCard";
import Profil from "../components/Profil";
import { getUsers, required, modifyUser } from "../utils/localeStorage";
import { openPack } from "../utils/functions";

const Collection = ({ navigation }) => {
  //Pour savoir quel contenu sera affiché (pilotes ou équipes)
  const [activeTab, swapActive] = useState(true);
  //Collection de pilotes de l'utilisateur
  const [pilotes, setPilotes] = useState([]);
  //Collection d'équipes de l'utilisateur
  const [teams, setTeams] = useState([]);
  //Informations sur l'utilisateur
  const [user, setUser] = useState([]);
  //Pour savoir si la popup doit être affiché ou non
  const [modalVisible, setModalVisible] = useState(false);
  //Contenu présent dans les paquets
  const [packRewards, setPackRewards] = useState(null);
  //Pour afficher la popup d'amélioration des cartes;
  const [modalUpgradeVisible, setModalUpgradeVisible] = useState(false);
  //La carte qui sera affichée pour être améliorée
  const [card, setCard] = useState(null);
  //Indique si la page est en chargement ou non
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPilotes() {
    const users = await getUsers();
    return users.collectionPilote;
  }

  async function fetchTeams() {
    const users = await getUsers();
    return users.collectionTeam;
  }

  //Récupération des données
  async function fetchData() {
    const data = await fetchPilotes();
    const teams = await fetchTeams();
    const users = await getUsers();
    setPilotes(data);
    setTeams(teams);
    setUser(users);
    if (users != null) {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      // fonction de nettoyage
      return () => {
        // code à exécuter lorsque l'écran est en cours de suppression de la pile de navigation
      };
    }, [])
  );

  //Fonction qui affiche la barre de navigation de la collection
  function createTabs() {
    //Le style change en fonction de ce qui est affiché
    if (activeTab) {
      return (
        <View style={styles.collectionTab}>
          <View style={styles.activeTab}>
            <Text style={styles.activeTabText}>Pilotes</Text>
          </View>
          <TouchableOpacity
            style={styles.inactiveTab}
            onPress={() => swapActive(false)}
          >
            <Text style={styles.inactiveTabText}>Ecuries</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.collectionTab}>
        <TouchableOpacity
          style={styles.inactiveTab}
          onPress={() => swapActive(true)}
        >
          <Text style={styles.inactiveTabText}>Pilotes</Text>
        </TouchableOpacity>
        <View style={styles.activeTab}>
          <Text style={styles.activeTabText}>Ecuries</Text>
        </View>
      </View>
    );
  }

  //Fonction pour améliorer une carte
  async function upgradeCard(item) {
    //On vérifie que la carte ne soit pas déjà au niveau max
    if (item.level < 4) {
      //On vérifie si l'amélioration concerne un pilote ou une écurie
      if (activeTab) {
        //On retrouve quelle carte est améliorée
        for (let i = 0; i < user.collectionPilote.length; i++) {
          if (user.collectionPilote[i].id == item.id) {
            //Actualisation de item pour l'affichage et amélioration de la carte
            const updatedUser = user;
            updatedUser.collectionPilote[i].copies -=
              required[item.level - 1].copies;
            updatedUser.collectionPilote[i].level += 1;
            updatedUser.money -= required[item.level - 1].price;
            item.copies -= required[item.level - 1].copies;
            item.level += 1;
            setUser(updatedUser);
            await modifyUser(user);
            setModalUpgradeVisible(false);
          }
        }
      } else {
        //Code plus ou moins similaire pour une carte d'écurie
        for (let i = 0; i < user.collectionTeam.length; i++) {
          if (user.collectionTeam[i].id == item.id) {
            //Actualisation de item pour l'affichage
            const updatedUser = user;
            updatedUser.collectionTeam[i].copies -=
              required[item.level - 1].copies;
            updatedUser.collectionTeam[i].level += 1;
            updatedUser.money -= required[item.level - 1].price;
            item.copies -= required[item.level - 1].copies;
            item.level += 1;
            setUser(updatedUser);
            await modifyUser(user);
            setModalUpgradeVisible(false);
          }
        }
      }
    }
  }

  function showPopupUpgrade(item) {
    if (item == null || !modalUpgradeVisible) {
      return null;
    }
    if (activeTab) {
      return (
        <View style={collection.screenPopup}>
          <TouchableOpacity
            onPress={() => setModalUpgradeVisible(false)}
            style={collection.backButton}
          />
          <View style={collection.popupUpgradeContainer}>
            {item.level < 4 &&
            item.copies >= required[item.level - 1].copies &&
            user.money >= required[item.level - 1].price ? (
              <TouchableOpacity
                style={collection.upgradeButton}
                onPress={async () => upgradeCard(item)}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Améliorer
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                Ne peut pas encore améliorer
              </Text>
            )}
            <PiloteCard
              nationality={item.nationality[0]}
              number={item.number[0]}
              level={item.level}
              name={item.familyName[0]}
            />
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Copies : {item.copies} /{" "}
              {item.level < 4 ? required[item.level - 1].copies : "max"}
            </Text>
            <Text
              style={
                item.level < 4 && user.money < required[item.level - 1].price
                  ? { fontSize: 16, fontWeight: "bold", color: "red" }
                  : { fontSize: 16, fontWeight: "bold" }
              }
            >
              Prix : {item.level < 4 ? required[item.level - 1].price : "Max"}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={collection.screenPopup}>
          <TouchableOpacity
            onPress={() => setModalUpgradeVisible(false)}
            style={collection.backButton}
          />
          <View style={popupUpgradeContainerTeams}>
            {item.level < 4 &&
            item.copies >= required[item.level - 1].copies &&
            user.money >= required[item.level - 1].price ? (
              <TouchableOpacity
                style={collection.upgradeButton}
                onPress={async () => upgradeCard(item)}
              >
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  Améliorer
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ fontWeight: "bold", textAlign: "center" }}>
                Ne peut pas encore améliorer
              </Text>
            )}
            <TeamCard
              name={item.name[0]}
              level={item.level}
              pilots={item.pilots}
            />
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Copies : {item.copies} /{" "}
              {item.level < 4 ? required[item.level - 1].copies : "Max"}
            </Text>
            <Text
              style={
                item.level < 4 && user.money < required[item.level - 1].price
                  ? { fontSize: 16, fontWeight: "bold", color: "red" }
                  : { fontSize: 16, fontWeight: "bold" }
              }
            >
              Prix : {item.level < 4 ? required[item.level - 1].price : "Max"}
            </Text>
          </View>
        </View>
      );
    }
  }

  //Fonction qui affiche le contenu de la collection de pilotes de l'utilisateur
  function afficheCollection() {
    return (
      <ScrollView style={{ marginLeft: 12, width: "100%" }}>
        <View style={styles.collection}>
          {pilotes.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setModalUpgradeVisible(true);
                  setCard(item);
                }}
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

  //Fonction qui affiche le contenu de la collection de teams de l'utilisateur
  function afficheTeams() {
    return (
      <ScrollView style={{ marginLeft: 12, width: "100%", height: "100%" }}>
        <View style={styles.collection}>
          {teams.map((item) => {
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setModalUpgradeVisible(true);
                  setCard(item);
                }}
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

  //On affiche la collection choisie par l'utilisateur (pilotes ou teams)
  function createCollection() {
    if (activeTab) {
      return afficheCollection();
    }
    return afficheTeams();
  }

  return isLoading ? (
    <View>
      <Text>Chargement</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Carrousel navigation={navigation} />
      <Profil
        titre="Collection"
        money={user.money}
        name={user.name}
        points={user.points}
      />
      <View style={styles.collectionContainer}>
        {createTabs()}
        {createCollection()}
      </View>
      <TouchableOpacity
        onPress={async () => {
          setModalVisible(true);
          await fetchData();
        }}
        style={styles.paquets}
      >
        <Text style={styles.paquetsText}>Paquets</Text>
        {
          //On affiche la notifications seulement si l'utilisateur possède des paquets
          user != null && user.packs > 0 && (
            <View style={styles.notification}>
              <Text style={styles.notificationText}>{user.packs}</Text>
            </View>
          )
        }
      </TouchableOpacity>
      {
        //popup pour l'ouverture des paquets si l'utilisateur en possède
      }
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={async () => {
          setModalVisible(false);
          setPackRewards(null);
          await fetchData();
        }}
        transparent={true}
      >
        <View style={collection.popupOpenPacks}>
          {
            //Pour permettre à l'utilisateur de quitter la popup en cliquant à côté
          }
          <TouchableOpacity
            onPress={async () => {
              setModalVisible(false);
              setPackRewards(null);
              await fetchData();
            }}
            style={collection.backButton}
          />
          <View style={collection.popupOpenPackContainer}>
            {
              //Affichage des récompenses dans le paquet qui vient d'être ouvert
            }
            {packRewards != null && (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ height: 60, width: 60 }}>
                    <Image
                      source={require("../assets/coin.png")}
                      style={{
                        flex: 1,
                        resizeMode: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </View>
                  <Text
                    style={{ fontSize: 32, fontWeight: "bold", marginLeft: 12 }}
                  >
                    {packRewards.money}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <PiloteCard
                    nationality={packRewards.pilots[0].nationality[0]}
                    number={packRewards.pilots[0].number[0]}
                    level={1}
                    name={packRewards.pilots[0].familyName[0]}
                  />
                  <PiloteCard
                    nationality={packRewards.pilots[1].nationality[0]}
                    number={packRewards.pilots[1].number[0]}
                    level={1}
                    name={packRewards.pilots[1].familyName[0]}
                  />
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <PiloteCard
                    nationality={packRewards.pilots[2].nationality[0]}
                    number={packRewards.pilots[2].number[0]}
                    level={1}
                    name={packRewards.pilots[2].familyName[0]}
                  />
                  <PiloteCard
                    nationality={packRewards.pilots[3].nationality[0]}
                    number={packRewards.pilots[3].number[0]}
                    level={1}
                    name={packRewards.pilots[3].familyName[0]}
                  />
                </View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <TeamCard
                    name={packRewards.teams[0].name[0]}
                    level={1}
                    pilots={packRewards.teams[0].pilots}
                  />
                  <TeamCard
                    name={packRewards.teams[1].name[0]}
                    level={1}
                    pilots={packRewards.teams[1].pilots}
                  />
                </View>
              </View>
            )}
            {
              //Bouton qui permet l'ouverture d'un paquet
            }
            <TouchableOpacity
              onPress={async () => {
                if (user.packs > 0) {
                  await openPack(setPackRewards, setUser);
                }
              }}
              style={collection.openPackButton}
            >
              <Text style={styles.paquetsText}>Ouvrir</Text>
              {user != null && user.packs > 0 && (
                <View style={styles.notification}>
                  <Text style={styles.notificationText}>{user.packs}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalUpgradeVisible}
        animationType="slide"
        onRequestClose={() => {
          setModalUpgradeVisible(false);
          showPopupUpgrade(null);
        }}
        transparent={true}
      >
        {showPopupUpgrade(card)}
      </Modal>
    </View>
  );
};

export default Collection;
