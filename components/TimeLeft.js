import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text } from "react-native";
import { getCircuits } from "../utils/localeStorage";
import { timeLeft } from "../theme/styles";

const TimeLeft = () => {
  //Pour avoir la date du jour
  const [date, setDate] = useState(new Date());
  //Pour avoir la date du prochain Grand Prix
  const [nextDate, setNextDate] = useState(new Date());

  const recupNextGP = async () => {
    const circuits = await getCircuits();
    if (circuits != null) {
      for (let i = 0; i < circuits.length; i++) {
        if (date < new Date(circuits[i].date[0])) {
          setNextDate(new Date(circuits[i].date[0]));
          i = circuits.length;
        }
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      recupNextGP();

      return () => {};
    }, [])
  );

  //Convertir la date en jours et en heures
  function convertHoursToDaysAndHours(hours) {
    const days = Math.floor(hours / 24);
    const remainingHours = (hours % 24).toFixed(1);
    return `${days} jour(s) et ${remainingHours} heure(s)`;
  }

  return (
    <View style={timeLeft.container}>
      <Text style={timeLeft.text}>
        Temps restant :{" "}
        {convertHoursToDaysAndHours(
          ((nextDate - date).toLocaleString() / 3600000).toFixed(1) - 48
        )}
      </Text>
    </View>
  );
};

export default TimeLeft;
