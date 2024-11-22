<template>
    <div class="login-container">
      <div class="login-form">
        <h2>LogIn Facebook</h2>
        <form >
          <div class="form-group">
            <input type="text"  placeholder="Email or phone number" required/>
          </div>
          <div class="form-group">
            <input type="password"  placeholder="Password"
              required
            />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox"/>
              Remember password
            </label>
          </div>
          <button type="submit" class="btn">Log In</button>
          <a href="#" class="forgot-password">Forgot password?</a>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  
  </script>
  
  <style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
  }
  
  .login-form {
    background: white;
    padding: 20px;
    width: 300px;
    border-radius: 8px;
    text-align: center;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  input[type="text"],
  input[type="password"] {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  label {
    display: flex;
    font-size: 12px;
    color: #555;
    gap: 3px;
    
  }
  
  .btn {
    background-color: #1877f2;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #155db2;
  }
  
  .forgot-password {
    display: block;
    margin-top: 15px;
    font-size: 12px;
    color: #1877f2;
    text-decoration: none;
  }
  
  .forgot-password:hover {
    text-decoration: underline;
  }
  </style>
  