import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ImageBackground
} from "react-native";
import { useSelector } from "react-redux";

export default function ResetPasswordScreen({ route, navigation }) {
  const { resetEmail } = useSelector((state) => state.user.value);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = () => {
    if (!newPassword) {
      setError("Veuillez entrer un nouveau mot de passe");
      return;
    }

    setError("");

    fetch(
        //Cette route permet la réinitialisation avec hashage du nouveau mdp
      `http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/updatePassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword, resetEmail }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(`Erreur du serveur: ${response.status} - ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          Alert.alert("Succès", "Votre mot de passe a été réinitialisé.", [{
            text: 'Se connecter',
            onPress: () => {navigation.replace("Login");}
          }]);
        }
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la réinitialisation du mot de passe : ",
          error
        );
        setError("Une erreur est survenue. Veuillez réessayer.");
      });
  };

  return (
    <ImageBackground
      style={styles.bg}
      source={require("../assets/background.png")}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Réinitialiser votre mot de passe</Text>

        <TextInput
          placeholder="Entrez votre nouveau mot de passe"
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Réinitialiser le mot de passe</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 12,
    width: 300,
    height: 40,
    borderRadius: 10,
    textAlign: "center",
    marginVertical: 8,
  },
  button: {
    backgroundColor: "#B5E5A7",
    paddingVertical: 12,
    width: 200,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
    fontWeight: "bold",
  },
});
