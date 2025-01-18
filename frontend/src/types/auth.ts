export interface User {
  id: string;
  email: string;
  role: "buyer" | "seller";
  profile: {
    name: string;
    phone: string;
    avatar: string;
    identityVerified: boolean;
    realNameVerified: boolean;
    documents: {
      identity: string[];
      ownership: string[];
    };
  };
  preferences?: {
    religions: string[];
    priceRange: {
      min: number;
      max: number;
    };
    locations: string[];
  };
  statistics?: {
    listings: number;
    matches: number;
    views: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "buyer" | "seller";
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
