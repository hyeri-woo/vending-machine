import DrinkGenerator from "./classes/drinkGenerator.js";
import VendingMachineEvents from "./classes/vendingMachineEvents.js";
import StartScreenEvents from "./classes/startScreenEvents.js";

const startScreenEvents = new StartScreenEvents();
const drinkGenerator = new DrinkGenerator();
const vendingMachineEvents = new VendingMachineEvents();

await drinkGenerator.setup();
vendingMachineEvents.bindEvent();
startScreenEvents.bindEvent();