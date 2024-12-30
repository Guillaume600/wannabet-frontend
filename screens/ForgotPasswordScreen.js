import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";  
import { setResetInfo } from "../reducers/users";  

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState(email);
  const [resetCode, setResetCode] = useState(""); //Attention cet état gère le code de réinitialisation
  const [error, setError] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false); //Tant que ce n'est pas true, le second input n'apparait pas
  const dispatch = useDispatch();

  const handlePasswordReset = () => {
    if (!email && !isCodeSent) {
      setError("Veuillez saisir une adresse email");
      return;
    }

    if (isCodeSent && !resetCode) {
      setError("Veuillez entrer le code de réinitialisation");
      return;
    }

    setError(""); 

    if (!isCodeSent) {
        //Cette première route permet d'envoyer un mail contenant un code grâce à nodemailer
      fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
        .then((response) => {
            if (!response.ok) {
                console.error(`Erreur du serveur: ${response.status}`);
                return;
          }
          return response.json(); 
        })
        .then((data) => {
          if (data.error) {
            setError(data.error); 
          } else {
            //On dispatch le mail et le code pour le récupérer sur l'écran suivant
            dispatch(setResetInfo({ email, resetCode }));
            Alert.alert("Succès", "Un email avec un code de réinitialisation a été envoyé.", [{
              text: 'Saisir code',
              onPress: () => {setIsCodeSent(true); }
            }]);
          }
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du mail : ", error);
          setError("Une erreur est survenue. Veuillez réessayer.");
        });
    }
    else {
        //Cette route permet de vérifier le code reçu par mail et l'input n'apparait qu'une fois le code envoyé
      fetch(`http://${process.env.EXPO_PUBLIC_IP_ADDRESS}:3000/users/verifyResetCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, resetCode }),
      })
        .then((response) => {
            if (!response.ok) {
                console.error(`Erreur du serveur: ${response.status}`);
                return;
          }
          return response.json(); 
        })
        .then((data) => {
          if (data.error) {
            setError(data.error); 
          } else {
            //Navigation uniquement si code validé
            navigation.navigate("ResetPassword"); 
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la validation du code : ", error);
          setError("Une erreur est survenue. Veuillez réessayer.");
        });
    }
  };

  return (
    <ImageBackground style={styles.bg} source={require("../assets/background.png")}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <View style={styles.mainContainer}>
          <Text style={styles.title}>Mot de passe oublié</Text>

          <TextInput
            placeholder="Entrez votre email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!isCodeSent} 
          />

          {isCodeSent && (
            <TextInput
              placeholder="Entrez le code de réinitialisation"
              style={styles.input}
              value={resetCode}
              onChangeText={setResetCode}
            />
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>
              {isCodeSent ? "Valider le code" : "Réinitialiser"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logout} onPress={() => navigation.replace("Login")}>
            <Text style={styles.buttonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    color: "white",
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
  logout: {
    backgroundColor: "#ba0707",
    paddingVertical: 12,
    width: 200,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Freeman-Regular",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginVertical: 10,
    fontWeight: "bold",
  },
});
