import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
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

const Connexion = ({ navigation }) => {
  //Variables utiles pour le formulaire
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //Fonction qui s'effectue à la création de l'utilisateur
  //Il faut donc remplir toute la BDD et créé l'utilisateur avec le mdp et le login choisi
  const handleLogin = async () => {
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
    <View
      style={{
        flex: 1,
        backgroundColor: "#2B2E42",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "white",
          fontSize: 24,
          textAlign: "center",
        }}
      >
        Choisissez un nom d'utilisateur et un mot de passe
      </Text>
      <View style={{ width: "70%" }}>
        <Text style={styles.label}>Nom d'utilisateur</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Entrez votre nom d'utilisateur"
          placeholderTextColor="white"
          autoCapitalize="none"
        />
      </View>
      <View style={{ width: "70%" }}>
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Entrez votre mot de passe"
          placeholderTextColor="white"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Connexion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "white",
  },
  button: {
    backgroundColor: "#BCC2CA",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
