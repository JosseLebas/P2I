import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { card } from "../theme/styles";

const Card = ({
  condition,
  bonus1,
  bonus2,
  bonus3,
  pointsCondition,
  image,
  modalVisible,
  setModalVisible,
  setCurrentChoice,
  choice,
  isNextGP,
  setModalInfosVisible,
}) => {
  const afficheBonus = (type) => {
    if (type == 1) {
      return card.gris;
    } else if (type == 2) {
      return card.rouge;
    } else {
      return card.vert;
    }
  };

  const afficheModal = () => {
    if (modalVisible) {
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
    setCurrentChoice(choice);
  };

  return (
    <View style={card.view}>
      <View style={card.container}>
        <TouchableOpacity
          onPress={() => (isNextGP ? afficheModal() : null)}
          style={card.pilote}
        >
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            style={
              typeof image === "string"
                ? { flex: 1, width: "100%", height: "100%" }
                : null
            }
          />
          {typeof image === "string" ? null : (
            <Text style={[card.text, card.plusText]}>+</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={card.condition}
          onPress={() => {setCurrentChoice(choice)
            setModalInfosVisible(true)}}
        >
          <Text style={[card.text, card.conditionText]}>{condition}</Text>
          <View style={card.ellipse}>
            <Text style={[card.text, card.pointsText]}>
              + {pointsCondition}
            </Text>
            <Image
              source={require("../assets/point.png")}
              style={{ width: "40%", height: "40%" }}
            />
          </View>
        </TouchableOpacity>
        <View style={card.containerCircles}>
          <View style={[card.cercle, afficheBonus(bonus1)]}>
            <FontAwesome
              name={"flag"}
              size={20}
              color={afficheBonus(bonus1).borderColor}
            />
          </View>
          <View style={[card.cercle, afficheBonus(bonus2)]}>
            <MaterialCommunityIcons
              name={"headset"}
              size={20}
              color={afficheBonus(bonus2).borderColor}
            />
          </View>
          <View style={[card.cercle, afficheBonus(bonus3)]}>
            <Text
              style={[
                card.text,
                card.multiplicateurText,
                { color: afficheBonus(bonus3).borderColor },
              ]}
            >
              x2
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Card;
