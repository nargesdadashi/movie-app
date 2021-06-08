import { db } from "./firebase";

export const getLists = (uid) => {
  return db.ref(`movies_list/${uid}`);
};

export const pushToToWatchList = async (uid, id) => {
  try {
    await db.ref(`movies_list/${uid}`).child("towatch").child(id).set(id);
  } catch (error) {
    console.log(error.message);
  }
};

export const pushToWatchedList = async (uid, id) => {
  try {
    await db.ref(`movies_list/${uid}`).child("watched").child(id).set(id);
  } catch (error) {
    console.log(error.message);
  }
};

export const removeFromToWatchList = async (uid, id) => {
  try {
    await db.ref(`movies_list/${uid}`).child("towatch").child(id).remove();
  } catch (error) {
    console.log(error.message);
  }
};

export const removeFromWatchedList = async (uid, id) => {
  try {
    await db.ref(`movies_list/${uid}`).child("watched").child(id).remove();
  } catch (error) {
    console.log(error.message);
  }
};
