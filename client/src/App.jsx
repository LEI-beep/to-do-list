import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
const navigate = useNavigate();

const [username,setUsername] = useState('');
const [password,setPassword] = useState('');

//conditional rendering
const [showError, setShowError] = useState(false);

const handleLogin = async () => {
  await axios.post('http://localhost:3000/check-user', {username,password})
  .then((response) => {
    if(response.data.exist){
      setShowError(false);
      navigate('/todo');
    }
    else {
      setShowError(true);
    }
  })
}

  return (
    <>
 <div className="w-screen h-screen bg-gradient-to-br from-[#EABDE6] to-[#FFDFEF] flex justify-center items-center">
  {/* Container for Split Layout */}
  <div className="flex w-full max-w-7xl h-[600px] rounded-3xl overflow-hidden shadow-lg">
    {/* Left Side: Login Form */}
    <div className="w-1/2 bg-[#FFDFEF]/70 backdrop-blur-md p-8 space-y-6 flex flex-col justify-center">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center text-[#AA60C8]">To do</h1>

      {/* Error Message */}
      {showError && (
        <div className="bg-[#FFEBE6] border border-[#FFA08C] text-[#FF4D4D] px-4 py-3 rounded-lg">
          Invalid Username or Password
        </div>
      )}

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-[#AA60C8]">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="w-full px-4 py-3 bg-[#FFDFEF]/50 border border-[#D69ADE]/50 rounded-md placeholder-[#D69ADE]/70 focus:outline-none focus:ring-2 focus:ring-[#D69ADE] transition-all"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-[#AA60C8]">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-3 bg-[#FFDFEF]/50 border border-[#D69ADE]/50 rounded-md placeholder-[#D69ADE]/70 focus:outline-none focus:ring-2 focus:ring-[#D69ADE] transition-all"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Login Button */}
      <button
        type="button"
        onClick={handleLogin}
        className="w-full py-3 font-medium text-white bg-[#AA60C8] rounded-md hover:bg-[#8E4DA6] focus:outline-none focus:ring-2 focus:ring-[#D69ADE] transition-all"
      >
        Login
      </button>

      {/* Footer Text */}
      <p className="text-center text-sm text-[#AA60C8]/70">
        © 2023 Kurt. All rights reserved.
      </p>
    </div>

    {/* Right Side: Decorative Image */}
    <div
      className="w-1/2 bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://pbs.twimg.com/media/GiUfavNWAAARB6-?format=jpg&name=medium)",
      }}
    >
      {/* Overlay for Text */}
      <div className="h-full flex flex-col justify-end p-8">
      </div>
    </div>
  </div>
</div>
      </>   
  )
}

export default App;
