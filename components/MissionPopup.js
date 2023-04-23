import React from "react";
import { Modal, Text, TouchableOpacity, View, Image } from "react-native";
import { missionPopup } from "../theme/styles";

const MissionPopup = ({
  missionTitle,
  missionDescription,
  setModalInfosVisible,
  modalInfosVisible,
  points,
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalInfosVisible}>
      <View style={missionPopup.modalContainer}>
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
          onPress={() => setModalInfosVisible(false)}
        />
        <View style={missionPopup.modalContent}>
          <Text style={missionPopup.modalTitle}>{missionTitle}</Text>
          <Text style={missionPopup.modalDescription}>
            {missionDescription}
          </Text>
          <View style={missionPopup.ellipse}>
            <Text style={[missionPopup.text, missionPopup.pointsText]}>
              + {points}
            </Text>
            <Image
              source={require("../assets/point.png")}
              style={{ width: "40%", height: "40%" }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MissionPopup;
