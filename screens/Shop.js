import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import styles from "../theme/styles";
import { shop } from "../theme/styles";
import Carrousel from "../components/Carrousel";
import Profil from "../components/Profil";
import { getUsers, modifyUser } from "../utils/localeStorage";

const Shop = ({ navigation }) => {
  //Variable pour afficher la popup d'achat réussi ou non
  const [show, setShow] = useState(false);
  //Variable contenant les informations de l'utilisateur
  const [user, setUser] = useState(null);
  //Varibale indiquant si la page est en chargement ou non
  const [isLoading, setIsLoading] = useState(true);

  //Récupération des données à l'ouverture de la page
  async function fetchData() {
    const users = await getUsers();
    setUser(users);
    if (users != null) {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      return () => {};
    }, [])
  );

  //Fonction pour acheter des paquets selon le nombre et le prix
  async function buyPacks(prix, nbPacks) {
    const user = await getUsers();
    //Vérification que l'utilisateur possède assez d'argent
    if (user.money >= prix) {
      //Si c'est le cas, ajout des paquets et suppression de l'argent
      user.packs += nbPacks;
      user.money -= prix;
      setUser(user);
      modifyUser(user);
      return true;
    }
    return false;
  }

  //Dans le cas où la page est en train de charger
  return isLoading ? (
    <View>
      <Text>Chargement</Text>
    </View>
  ) : (
    <View style={styles.container}>
      <Carrousel navigation={navigation} />
      <View style={shop.smallContainer}>
        <Profil
          titre="Boutique"
          money={user.money}
          points={user.points}
          name={user.name}
        />
        {
          //Contenu de la boutique
        }
        <View style={shop.offersContainer}>
          <Text style={shop.offerText}>1 paquet </Text>
          <Text style={shop.offerText}>Prix : 120 </Text>
          <TouchableOpacity
            style={shop.buyButton}
            onPress={async () => (await buyPacks(120, 1)) && setShow(true)}
          >
            <Text style={shop.offerText}>Acheter</Text>
          </TouchableOpacity>
        </View>
        <View style={shop.offersContainer}>
          <Text style={shop.offerText}>5 paquets </Text>
          <Text style={shop.offerText}>Prix : 550 </Text>
          <TouchableOpacity
            style={shop.buyButton}
            onPress={async () => (await buyPacks(550, 5)) && setShow(true)}
          >
            <Text style={shop.offerText}>Acheter</Text>
          </TouchableOpacity>
        </View>
        <View style={shop.offersContainer}>
          <Text style={shop.offerText}>10 paquets </Text>
          <Text style={shop.offerText}>Prix : 1000 </Text>
          <TouchableOpacity
            style={shop.buyButton}
            onPress={async () => (await buyPacks(1000, 10)) && setShow(true)}
          >
            <Text style={shop.offerText}>Acheter</Text>
          </TouchableOpacity>
        </View>

        <Text style={shop.boutiqueText}>Prochainement...</Text>
      </View>
      {
        //Popup de l'achat réussi
      }
      <Modal visible={show} animationType="fade" transparent={true}>
        {
          //Pour permettre à l'utilisateur de quitter la popup en cliquant à côté
        }
        <TouchableOpacity
          onPress={async () => {
            setShow(false);
            setPackRewards(null);
            await fetchData();
          }}
          style={shop.backButton}
        />
        <View style={shop.modalContainer}>
          <View style={shop.popup}>
            <Text style={shop.title}>Achat réussi !</Text>
            <Text style={shop.message}>Merci pour votre achat.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Shop;
