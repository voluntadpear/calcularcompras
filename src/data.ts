export const taxCategories = [
  {
    key: 'electronica',
    label: 'Electrónica y Telecomunicaciones',
    tax: 21,
  },
  {
    key: 'laptops',
    label: 'Laptops',
    tax: 15
  },
  {
    key: 'celulares',
    label: 'Celulares',
    tax: 21
  },
  {
    key: 'gps',
    label: 'GPS',
    tax: 18
  },
  {
    key: 'videojuegos',
    label: 'Videojuegos y Consolas',
    tax: 22,
  },
  {
    key: 'juguetes',
    label: 'Juguetes',
    tax: 38,
  },
  {
    key: 'suplementos_deportivos',
    label: 'Suplementos Deportivos',
    tax: 24,
  },
  {
    key: 'articulos_deportivos',
    label: 'Artículos Deportivos',
    tax: 30,
  },
  {
    key: 'bijouterie',
    label: 'Bijouterie',
    tax: 26,
  },
  {
    key: 'tabaco',
    label: 'Tabaco',
    tax: 48,
  },
  {
    key: 'ropa',
    label: 'Ropa',
    tax: 43,
  },
  {
    key: 'cuero',
    label: 'Cuero',
    tax: 38,
  },
  {
    key: 'cosmeticos',
    label: 'Cosméticos y Perfumería',
    tax: 30,
  },
  {
    key: 'hogar',
    label: 'hogar y Cocina',
    tax: 25,
  },
  {
    key: 'automotor',
    label: 'Respuestos del Automotor',
    tax: 25,
  },
  {
    key: 'antiguedades',
    label: 'Obras de Arte & Antiguedades',
    tax: 22,
  },
  {
    key: 'instrumentos_musicales',
    label: 'Instrumentos Músicales',
    tax: 36,
  },
  {
    key: 'vape',
    label: 'Vape',
    tax: 26,
  },
  {
    key: 'esencias_vape',
    label: 'Esencias para Vape',
    tax: 38,
  },
  {
    key: 'articulos_mascotas',
    label: 'Artículos para Mascotas',
    tax: 38
  },
  {
    key: 'cultura_fisica',
    label: 'Cultura Física',
    tax: 38
  }
];

export interface Courier {
  key: string;
  label: string;
  pricePerKilo?: number;
  taxIncludedPlanPricePerKilo?: number;
}

export const couriers: Courier[] = [
  {
    key: 'globalbox',
    label: 'Globalbox',
    pricePerKilo: 16.5,
    taxIncludedPlanPricePerKilo: 21.5
  },
  {
    key: 'paraguaybox',
    label: 'Paraguaybox',
    pricePerKilo: 16.5,
    taxIncludedPlanPricePerKilo: 21.5
  },
  {
    key: 'netbox',
    label: 'Netbox',
    taxIncludedPlanPricePerKilo: 21
  },
  {
    key: 'sendit',
    label: 'Sendit',
    taxIncludedPlanPricePerKilo: 20.9
  },
  {
    key: 'saspy',
    label: 'Saspy',
    pricePerKilo: 15.5,
    taxIncludedPlanPricePerKilo: 20.5
  },
  {
    key: 'pytade',
    label: 'PyTrade',
    taxIncludedPlanPricePerKilo: 20.9
  },
  {
    key: 'dinacopa',
    label: 'Club Dinacopa Box',
    pricePerKilo: 15.5
  },
];

export const ivaCasualTax = 0.13;