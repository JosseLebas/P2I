import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { piloteCard } from "../theme/styles";

const PiloteCard = ({ level, nationality, name, number }) => {
  const nationalityToCountryCode = {
    French: "fr",
    Spanish: "es",
    Italy: "it",
    Thai: "th",
    Finnish: "fi",
    Dutch: "nl",
    British: "gb",
    German: "de",
    Monegasque: "mo",
    Danish: "dk",
    Mexican: "mx",
    Australian: "au",
    American: "us",
    Canadian: "ca",
    Japanese: "jp",
    Chinese: "cn",
  };

  const levelToColor = {
    1: "#AAAAAA",
    2: "#81D3F8",
    3: "#C70EBC",
    4: "#FFFF80",
  };

  return (
    <View style={[piloteCard.container, { borderColor: levelToColor[level] }]}>
      <View style={piloteCard.elements}>
        <Text style={piloteCard.number}>{number}</Text>
        <View style={piloteCard.drapeau}>
          <Image
            style={{ flex: 1, resizeMode: "contain", borderRadius: 10 }}
            source={{
              uri:
                "https://flagcdn.com/16x12/" +
                nationalityToCountryCode[nationality] +
                ".png",
            }}
          />
        </View>
        <View style={[piloteCard.circle, { borderColor: levelToColor[level] }]}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: levelToColor[level],
            }}
          >
            {level}
          </Text>
        </View>
      </View>
      <View style={piloteCard.pilote}>
        <Image
          style={{
            flex: 1,
            resizeMode: "contain",
            width: "100%",
            height: "100%",
          }}
          source={{
            uri:
              "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/" +
              name.toLowerCase().replace(" ", "") +
              ".jpg.img.1920.medium.jpg/1677069773437.jpg",
          }}
        />
      </View>
    </View>
  );
};

export default PiloteCard;
