import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Definiši Counter šemu
const CounterSchema = new Schema({
  collectionName: { type: String, required: true, unique: true },
  sequenceValue: { type: Number, required: true },
});

// Funkcija za dobijanje sledeće vrednosti sekvence
export async function getNextSequenceValue(collectionName: string) {
  const counter = await Counter.findOneAndUpdate(
    { collectionName },
    { $inc: { sequenceValue: 1 } },
    { new: true, upsert: true } // Ako ne postoji, kreira novi dokument
  );
  return counter.sequenceValue;
}

// Kreiraj Counter model
const Counter = mongoose.model("Counter", CounterSchema, "counters");

export default Counter;
