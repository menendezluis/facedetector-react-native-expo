import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = React.useState(null);
  const [faceData, setFaceData] = React.useState();

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === "granted");
    })();
  }, []);

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const getFaceDataView = () => {
    if (faceData?.length === 0) {
      return (
        <View style={styles.faces}>
          <Text>No face detected</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.faces}>
          {faceData?.map((face, index) => {
            const eyesOpenScore =
              face.leftEyeOpenProbability > 0.4 &&
              face.rightEyeOpenProbability > 0.4;
            const winkingScore =
              !eyesOpenScore &&
              (face.leftEyeOpenProbability < 0.4 ||
                face.rightEyeOpenProbability < 0.4);
            const smilingScore = face.smilingProbability > 0.7;
            return (
              <View key={index}>
                <Text style={styles.faceDescriptions}>
                  Eyes opened: {eyesOpenScore ? "🟢" : "🔴"}
                </Text>
                <Text style={styles.faceDescriptions}>
                  Winking: {winkingScore ? "🟢" : "🔴"}
                </Text>
                <Text style={styles.faceDescriptions}>
                  Smiling: {smilingScore ? "🟢" : "🔴"}
                </Text>
              </View>
            );
          })}
        </View>
      );
    }
  };
  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
  };
  return (
    <Camera
      style={styles.camera}
      type={Camera.Constants.Type.front}
      ratio="16:9"
      onFacesDetected={(faceData) => handleFacesDetected(faceData)}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,

        minDetectionInterval: 100,
        tracking: true,
      }}
    >
      {getFaceDataView(faceData)}
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  faces: {
    backgroundColor: "#fff",
    color: "#000",
    bottom: 1,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  faceDescriptions: {
    color: "#000",
    fontSize: 20,
    textAlign: "center",
  },
});
