import { View, Text, Image } from "react-native";
import styles from "../theme/styles";

const Profil = ({ titre, money, name, points }) => {
  return (
    <View
      style={{
        height: "14%",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <Text style={styles.collectionText}>{titre}</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
          height: "50%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "black",
            textAlign: "right",
            fontWeight: "bold",
            fontSize: 20,
            height: "100%",
          }}
        >
          {name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            width: "13%",
            alignItem: "center",
          }}
        >
          <Image
            style={{ height: "40%", width: "40%" }}
            source={require("../assets/coin.png")}
          />
          <Text
            style={{
              color: "black",
              textAlign: "right",
              fontWeight: "bold",
              marginLeft: 12,
            }}
          >
            {money}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: "100%",
            alignItem: "center",
          }}
        >
          <View style={{ height: "100%", width: "30%" }}>
            <Image
              style={{ height: "40%", width: "100%" }}
              source={require("../assets/point.png")}
            />
          </View>
          <Text
            style={{
              color: "black",
              textAlign: "right",
              fontWeight: "bold",
              marginLeft: 12,
            }}
          >
            {points}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Profil;
