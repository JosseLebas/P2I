import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput, Text, View, TouchableOpacity } from "react-native";
import {
  fillPilotes,
  fillCircuits,
  fillTeams,
  fillPiloteMissions,
  fillTeamMissions,
  resetPilotes,
  resetCircuits,
  resetTeams,
  resetPiloteMissions,
  resetTeamMissions,
  resetUsers,
  recupNextGP,
  createUserTest,
} from "../utils/localeStorage";
import { connexion } from "../theme/styles";

const Connexion = ({ navigation }) => {
  //Variables utiles pour le formulaire
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Fonction qui s'effectue à la création de l'utilisateur
  //Il faut donc remplir toute la BDD et créé l'utilisateur avec le mdp et le login choisi
  const login = async () => {
    await resetPilotes();
    await resetCircuits();
    await resetTeams();
    await resetPiloteMissions();
    await resetTeamMissions();
    await resetUsers();
    await fillPilotes();
    await fillCircuits();
    await fillTeams();
    await fillPiloteMissions();
    await fillTeamMissions();
    const nextGP = await recupNextGP();
    //Code pour créer réellement l'utilisateur
    /*await createUser(username, password).then(() =>
      navigation.navigate("Home", { round: nextGP.round, isNextGP: true })
    );*/
    //Création de l'utilisateur utile pour les tests
    createUserTest().then(() =>
      navigation.navigate("Home", { round: nextGP.round, isNextGP: true })
    );
  };

  //Fonction qui servait pour les tests pour repartir de 0
  const removeDatas = async () => {
    await resetPilotes();
    await resetCircuits();
    await resetTeams();
    await resetPiloteMissions();
    await resetTeamMissions();
    await resetUsers();
  };

  useFocusEffect(
    React.useCallback(() => {
      //removeDatas();

      return () => {};
    }, [])
  );

  //Affichage du formulaire
  return (
    <View style={connexion.container}>
      <Text style={connexion.title}>
        Choisissez un nom d'utilisateur et un mot de passe
      </Text>
      <View style={{ width: "70%" }}>
        <Text style={connexion.label}>Nom d'utilisateur</Text>
        <TextInput
          style={connexion.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Entrez votre nom d'utilisateur"
          placeholderTextColor="white"
          autoCapitalize="none"
        />
      </View>
      <View style={{ width: "70%" }}>
        <Text style={connexion.label}>Mot de passe</Text>
        <TextInput
          style={connexion.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Entrez votre mot de passe"
          placeholderTextColor="white"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={connexion.button} onPress={login}>
        <Text style={connexion.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Connexion;
