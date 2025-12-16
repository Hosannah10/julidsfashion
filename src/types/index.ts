export interface Product {
  id: number;
  wearName: string;
  price: number;
  description: string;
  category: string;
  image?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  name: string;
  phone: string;
}
