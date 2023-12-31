import React, { createContext, useContext, useState } from "react";
import { UserData } from "../types/workouts";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  userData: UserData | null;
  setUserData: (userData: UserData | null) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  userData: null,
  setUserData: () => {},
});

export const useAuth = () => useContext(AuthContext);

const storedToken = localStorage.getItem("token");
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(storedToken);
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

// post form data to API
const postFormData = async (url: string, requestBody: URLSearchParams) => {
  const response = await fetch(url, {
    method: "POST",
    body: requestBody.toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("Unauthorized");
    else {
      throw new Error("Request failed");
    }
  }

  const responseData = await response.json();
  return responseData;
};

export interface SingupFormData {
  name?: string;
  email: string;
  password: string;
  confirm_password?: string;
}

const getAuthResponse = async (formData: SingupFormData, type: string) => {
  const URL = `${import.meta.env.VITE_BACKEND_URL}/auth/${type}/`;
  let requestBody = new URLSearchParams();
  Object.entries(formData).forEach(([key, value]) => {
    if (key === "email") {
      requestBody.append("username", value);
    } else {
      requestBody.append(key, value);
    }
  });
  const response = await postFormData(URL, requestBody);
  return response;
};

export const loginUser = async (
  formData: SingupFormData,
  setToken: (token: string | null) => void,
) => {
  const response = await getAuthResponse(formData, "login");
  if (response.access_token) {
    localStorage.setItem("token", response.access_token);
    setToken(response.access_token);
  } else {
    throw new Error("Could not login user");
  }
  window.location.reload();
  return response;
};

export const registerUser = async (
  formData: SingupFormData,
  setToken: (token: string | null) => void,
) => {
  const response = await getAuthResponse(formData, "register");
  if (response.message && response.message === "User registered successfully") {
    const loginForm: SingupFormData = {
      email: formData.email,
      password: formData.password,
    };
    const loginResponse = await loginUser(loginForm, setToken);
    return loginResponse;
  } else {
    throw new Error("Could not register user");
  }
};
