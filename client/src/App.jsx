import React from 'react'
import ContactForm from './ContactForm'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Automated AI Phone Screening
        </h1>
        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
          Fill out the form below to receive an instant phone call from our AI HR Recruiter using Vapi.
        </p>
      </div>
      <div className="w-full">
        <ContactForm/>
      </div>
    </div>
  )
}
