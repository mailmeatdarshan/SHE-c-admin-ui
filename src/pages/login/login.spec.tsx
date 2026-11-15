import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from './login'


 describe("Login page", () => {
    it("should render the required fields", () => {
        render(<LoginPage />)
        //getBy -> throws an error
        //findBy -> Async
        //queryBy -> null
        expect(screen.getByPlaceholderText("Username or email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Forgot Password?" })).toBeInTheDocument();
    })
 }) 