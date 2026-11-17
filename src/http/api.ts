

//Auth service

import { api } from "./client";
import type { Credentials, AuthResponse } from "@/types";

export const login = (Credential: Credentials) =>
  api.post<AuthResponse>("/auth/login", Credential);

export const loginRequest = login;