export interface Product {
  _id: string;
  sellerId: string;
  basicInfo: {
    title: string;
    description: string;
    price: number;
    negotiable: boolean;
    images: string[];
    video?: string;
    virtualTour?: string;
  };
  location: {
    cemetery: string;
    address: string;
    city: string;
    district: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    surroundings: {
      parking: boolean;
      temple: boolean;
      restaurant: boolean;
      transportation: string[];
    };
  };
  features: {
    type: string;
    size: string;
    facing: string;
    floor: number;
    religion: string;
    feng_shui: {
      orientation: string;
      environment: string[];
      features: string[];
    };
  };
  legalInfo: {
    registrationNumber: string;
    ownershipCertificate: string;
    propertyRights: string[];
    expiryDate?: Date;
    transferable: boolean;
    restrictions: string[];
  };
  verification: {
    status: "pending" | "verified" | "rejected";
    documents: string[];
    verifiedAt?: Date;
    verifier?: string;
    notes?: string;
  };
  status: "draft" | "published" | "reserved" | "sold" | "deleted";
  statistics: {
    views: number;
    favorites: number;
    compares: number;
    inquiries: number;
    lastViewed?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  district?: string;
  type?: string;
  religion?: string;
  status?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}
