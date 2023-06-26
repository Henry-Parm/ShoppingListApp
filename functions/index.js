// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Firestore instance
const firestore = admin.firestore();

// eslint-disable-next-line
exports.decrementDay = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async (context) => {
      const foodItemsRef = firestore.collection("foodItems");

      // Get all food items
      const foodItemsSnapshot = await foodItemsRef.get();

      // Update each food item
      const batch = firestore.batch();
      foodItemsSnapshot.forEach((doc) => {
        const foodItem = doc.data();

        // Decrement duration if canAutoActivate is true
        if (foodItem.canAutoActivate) {
          if (foodItem.isActive) {
            // Reset duration to initialDuration if item is now inactive
            foodItem.duration = foodItem.initialDuration;
          } else {
            // Item is inactive, decrement duration
            foodItem.duration -= 1;

            // Set isActive to true if duration reaches 0
            if (foodItem.duration === 0) {
              foodItem.isActive = true;
            }
          }

          // Update the food item in the batch
          batch.update(doc.ref, foodItem);
        }
      });

      // Commit the batch update
      await batch.commit();

      console.log("Duration decremented successfully.");
    });
