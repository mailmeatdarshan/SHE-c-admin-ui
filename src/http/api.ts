

//Auth service

import { api } from "./client";
import type { Credentials, AuthResponse, User, CreateUserData } from "@/types";

export const login = (Credential: Credentials) =>
  api.post<AuthResponse>("/auth/login", Credential);

export const self = () =>
  api.get<User>("/auth/self");

export const logout = () =>
  api.post<{ message: string }>("/auth/logout");

export const getUsers = () =>
  api.get<User[]>("/users");

export const createUser = (userData: CreateUserData) =>
  api.post<{ id: number }>("/users", userData);


export const loginRequest = login;