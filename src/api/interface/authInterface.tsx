export interface AuthInterface {
  loading?: boolean;
  fcmToken?: string;
  user?: UserLoginInterface;
  token?: string;
  success?: boolean;
}

export interface UserLoginInterface {
  email_or_phone?: string | undefined | null;
  country_code?: string;
}

export interface UserLoginEmailInterface {
  email?: string;
}

export interface VerifyOtpInterface {
  phone: number | string | null;
  country_code: number | string | null;
  token: string | null;
  email: string | null;
  fcm_token: string;
}
export interface UpdatepasswordInterface {
  token: number;
  email: string;
  password: number;
  password_confirmation: number;
}



export interface UserRegistrationPayload {
  username: string;
  name: string;
  email: string;
  country_code: number | undefined;
  phone: number;
  referral_code?: string;
  address: AddressDataInterface;
  fcm_token: string
}

export interface AddressDataInterface {
  title: string;
  address: string;
  street_address: string;
  area_locality: string;
  city: string;
  country_id: number | undefined;
  state_id: number | undefined | null;
  postal_code: number | string;
  country_code: number;
  phone: number;
}
