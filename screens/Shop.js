import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Text, TouchableOpacity, View, Modal } from "react-native";
import styles from "../theme/styles";
import { shop } from "../theme/styles";
import Carrousel from "../components/Carrousel";
import Profil from "../components/Profil";
import { getUsers, modifyUser } from "../utils/localeStorage";

const Shop = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

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

  async function buyPacks(prix, nbPacks) {
    const user = await getUsers();
    if (user.money >= prix) {
      user.packs += nbPacks;
      user.money -= prix;
      setUser(user);
      modifyUser(user);
      return true;
    }
    return false;
  }

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
      <Modal visible={show} animationType="fade" transparent={true}>
        <View style={shop.modalContainer}>
          <View style={shop.popup}>
            <Text style={shop.title}>Achat réussi !</Text>
            <Text style={shop.message}>Merci pour votre achat.</Text>
            <TouchableOpacity style={shop.button} onPress={handleClose}>
              <Text style={shop.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Shop;
