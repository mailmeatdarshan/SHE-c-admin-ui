

//Auth service

import { api } from "./client";
import type { Credentials, AuthResponse, User } from "@/types";

export const login = (Credential: Credentials) =>
  api.post<AuthResponse>("/auth/login", Credential);

export const self = () =>
  api.get<User>("/auth/self");


export const loginRequest = login;