/* ═══════════════════════════════════════════
   QUANTIX — Config & Constants
═══════════════════════════════════════════ */

const CONFIG = {
  BASE_URL: 'http://localhost:5236/api',
};

const UNITS = {
  Length:      ['Feet', 'Inches', 'Yards', 'Centimeters'],
  Weight:      ['Grams', 'Kilograms', 'Pound'],
  Volume:      ['Litre', 'MilliLitre', 'Gallon'],
  Temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
};

const QUANTITY_TYPES = Object.keys(UNITS); // ['Length', 'Weight', 'Volume', 'Temperature']

const OPERATIONS = ['convert', 'compare', 'add', 'subtract', 'divide'];