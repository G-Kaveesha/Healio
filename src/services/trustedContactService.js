import {
  Linking,
  Platform,
} from "react-native";

import {
  collection,
  getDocs,
  limit,
  query,
} from "firebase/firestore";

import {
  auth,
  db,
} from "../firebase/firebaseConfig";


// ---------------------------------------------------------
// Get user's saved trusted contact
// ---------------------------------------------------------

export async function getTrustedContact() {
  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    return null;
  }


  const trustedContactsRef =
    collection(
      db,
      "users",
      currentUser.uid,
      "trustedContacts"
    );


  const trustedContactQuery =
    query(
      trustedContactsRef,
      limit(1)
    );


  const snapshot =
    await getDocs(
      trustedContactQuery
    );


  if (snapshot.empty) {
    return null;
  }


  const contactDocument =
    snapshot.docs[0];

  const data =
    contactDocument.data();


  const phoneNumber =
    data.phoneNumber ||
    data.phone ||
    data.mobile ||
    data.contactNumber ||
    null;


  const name =
    data.name ||
    data.contactName ||
    data.fullName ||
    "your trusted person";


  return {
    id:
      contactDocument.id,

    name,

    phoneNumber:
      phoneNumber
        ? String(
            phoneNumber
          ).trim()
        : null,
  };
}


// ---------------------------------------------------------
// Open phone SMS app with prepared message
//
// Healio does not silently send the SMS.
// The user confirms by tapping Send in their messaging app.
// ---------------------------------------------------------

export async function openTrustedContactMessage(
  contact
) {
  if (
    !contact ||
    !contact.phoneNumber
  ) {
    throw new Error(
      "No phone number was found for your trusted person."
    );
  }


  const message =
    "Hi, I’m reaching out because I’m having a difficult moment and could use some support. Could you please check in with me when you can?";


  const separator =
    Platform.OS === "ios"
      ? "&"
      : "?";


  const smsUrl =
    `sms:${contact.phoneNumber}${separator}body=${encodeURIComponent(
      message
    )}`;


  const canOpen =
    await Linking.canOpenURL(
      smsUrl
    );


  if (!canOpen) {
    throw new Error(
      "Healio could not open your messaging app."
    );
  }


  await Linking.openURL(
    smsUrl
  );
}