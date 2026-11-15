
const Loginpage = () => {
  return (
    <>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" placeholder="Username or email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="Password" />
      </div>
      <div>
        <input type="checkbox" id="remember" />
        <label htmlFor="remember">Remember me</label>
      </div>
      <button type="submit">Sign In</button>
      <a href="/forgot-password">Forgot Password?</a>
    </>
  )
}

export default Loginpage