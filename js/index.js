import DrinkGenerator from "./classes/drinkGenerator.js";
import VendingMachineEvents from "./classes/vendingMachineEvents.js";

const drinkGenerator = new DrinkGenerator();
const vendingMachineEvents = new VendingMachineEvents();

await drinkGenerator.setup();
vendingMachineEvents.bindEvent();