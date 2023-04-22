import React from "react";
import { View, Text, Image } from "react-native";
import { teamCard } from "../theme/styles";

const TeamCard = ({ level, name, pilots }) => {
  const levelToColor = {
    1: "#AAAAAA",
    2: "#81D3F8",
    3: "#C70EBC",
    4: "#FFFF80",
  };

  return (
    <View style={[teamCard.container, { borderColor: levelToColor[level] }]}>
      <View style={teamCard.elements}>
        <View style={teamCard.nameContainer}>
          <Text style={teamCard.teamName}>{name}</Text>
        </View>
        <View style={teamCard.logoContainer}>
          <Image
            style={{
              flex: 1,
              resizeMode: "contain",
              borderRadius: 10,
              width: "100%",
              height: "100%",
            }}
            source={{
              uri:
                "https://media.formula1.com/content/dam/fom-website/teams/2023/" +
                name.toLowerCase().replace(" ", "-") +
                "-logo.png.transform/2col/image.png",
            }}
          />
        </View>
        <View style={[teamCard.circle, { borderColor: levelToColor[level] }]}>
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
      <View style={teamCard.pilotesContainer}>
        <View style={teamCard.piloteContainer}>
          <Text style={teamCard.teamName}>{pilots[0]}</Text>
          <View style={teamCard.piloteImage}>
            <Image
              style={{
                flex: 1,
                resizeMode: "contain",
                borderRadius: 10,
                width: "100%",
                height: "100%",
              }}
              source={{
                uri:
                  "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/" +
                  pilots[0].toLowerCase().replace(" ", "") +
                  ".jpg.img.1920.medium.jpg/1677069773437.jpg",
              }}
            />
          </View>
        </View>
        <View style={teamCard.piloteContainer}>
          <Text style={teamCard.teamName}>{pilots[1]}</Text>
          <View style={teamCard.piloteImage}>
            <Image
              style={{
                flex: 1,
                resizeMode: "contain",
                borderRadius: 10,
                width: "100%",
                height: "100%",
              }}
              source={{
                uri:
                  "https://media.formula1.com/content/dam/fom-website/drivers/2023Drivers/" +
                  pilots[1].toLowerCase().replace(" ", "") +
                  ".jpg.img.1920.medium.jpg/1677069773437.jpg",
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default TeamCard;
