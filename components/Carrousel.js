import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-snap-carousel";
import { getCircuits, recupNextGP } from "../utils/localeStorage";
import { giveRewards } from "../utils/functions";
import { carrousel } from "../theme/styles";

const Carrousel = ({ navigation }) => {
  const [items, setItems] = useState([]);
  const [dateActuelle, setDateActuelle] = useState(new Date());
  const [firstItem, setFirstItem] = useState(0);
  let nextGPRound = 1;
  recupNextGP().then((resultat) => {
    if (resultat != null) {
      nextGPRound = resultat.round;
    }
  });

  const recupCircuits = async () => {
    try {
      response = await getCircuits();
      setItems(response);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        await recupCircuits();
        setDateActuelle(new Date());
      }
      fetchData();

      return () => {};
    }, [])
  );

  useEffect(() => {
    const getPos = () => {
      for (let i = 0; i < items.length; i++) {
        if (new Date(items[i].date[0]) >= dateActuelle) {
          return i;
        }
      }
      return 0;
    };
    setFirstItem(getPos());
  }, [items, dateActuelle]);

  return items ? (
    <Carousel
      data={items}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={carrousel.container}
            onPress={() => {
              giveRewards();
              navigation.navigate("Home", {
                round: item.round,
                isNextGP: nextGPRound == item.round ? true : false,
              });
            }}
          >
            <View style={carrousel.viewLeft}>
              <View style={carrousel.arrowLeft}></View>
              <Text style={[carrousel.text, carrousel.details]}>Détails</Text>
            </View>
            <View style={carrousel.viewMiddle}>
              <Text style={[carrousel.text, carrousel.statutText]}>
                {item.round == firstItem + 1 ? "Prochain Grand Prix" : ""}
              </Text>
              <Text style={[carrousel.text, carrousel.GPText]}>
                {item.name}
              </Text>
              <Text style={[carrousel.text, carrousel.dateText]}>
                {item.date}
              </Text>
            </View>
            <Image
              style={carrousel.circuit}
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Circuit_Bahrain.svg/480px-Circuit_Bahrain.svg.png",
              }}
            />
            <View style={carrousel.arrowRight}></View>
          </TouchableOpacity>
        );
      }}
      sliderWidth={400}
      itemWidth={400}
      firstItem={firstItem}
    />
  ) : (
    <View>
      <Text>Chargement</Text>
    </View>
  );
};

export default Carrousel;
