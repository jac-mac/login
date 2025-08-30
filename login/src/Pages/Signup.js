import React from "react";
import "./Signup.css";
import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmedPassword: '',
    firstName: '',
    lastName: ''
  })

  const [isMatchingPassword, setIsMatchingPassword] = useState(true);
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmedPassword) {
      setIsMatchingPassword(false);
    } 
    else {
      setIsMatchingPassword(true)
      const upperCaseFirstName = formData.firstName[0].toUpperCase() + formData.firstName.slice(1)
      const upperCaseLastName = formData.lastName[0].toUpperCase() + formData.lastName.slice(1)
      const formDataToSave = {
        email: formData.email,
        password: formData.password,
        firstName: upperCaseFirstName,
        lastName: upperCaseLastName
      };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSave),
      };
      try {
        const response = await fetch("http://localhost:3001/user/new", options);
        if (response.ok) {
          setFormData({
            email: '',
            password: '',
            confirmedPassword: '',
            firstName: '',
            lastName: ''
          })
        } else {
          console.log("Could not make this request. Try again later.");
        }
        const userData = await response.json();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFormDataChange = (e) => {
    const {name, value} = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  return (
    <div className="signup">
      <form className='signup-form' onSubmit={handleSignupSubmit}>
        <section className='signup-form-group'>
            <input
              required
              name="signup-first-name"
              type="firstname"
              placeholder="First Name"
              onChange={handleFormDataChange}
            />
            <input
              required
              name="signup-last-name"
              type="lastname"
              placeholder="Last Name"
              onChange={handleFormDataChange}
            />
          </section>
          <input
            required
            name="signup-email"
            type="text"
            placeholder="Email..."
            onChange={handleFormDataChange}
          /> 
        {/* ^^ lookup 3rd party email verifiers ^^ */}
        <section className='signup-form-grouping'>
          <input
            required
            name="signup-password"
            type="password"
            placeholder="Password..."
            onChange={handleFormDataChange}
          />
          <input
            required
            name="signup-confirmed-password"
            type="password"
            placeholder="Confirm Password..."
            onChange={handleFormDataChange}
          />
        </section>
        <button type="submit">Create Account</button>
      </form>
      {isMatchingPassword ? null : <p style={{color: 'red'}}>Passwords do not match. Try again.</p>}
    </div>
  );
}
