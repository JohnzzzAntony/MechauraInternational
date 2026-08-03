import { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
  loggedInAt?: string;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_SECRET ||
    "complex_password_at_least_32_characters_long_mechaura_admin_session_key",
  cookieName: "mechaura_admin_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  },
};
