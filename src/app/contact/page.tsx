'use client'
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import Footer from '@/components/homePage/Footer';
import Header from '@/components/homePage/Header';

const Contact = () => {
  return (
    <>
      <Header />
      <ContactForm />
      <Footer />
    </>
  );
};

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState({ success: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Remplacer par vos identifiants EmailJS
      await emailjs.send(
        'service_awoq1hr',  // remplacer par votre Service ID EmailJS
        'template_fdqf8su', // remplacer par votre Template ID EmailJS
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        'jDPWkjBpZnur8ac7I'      // remplacer par votre Public Key EmailJS
      );
      
      setStatus({ success: true, message: 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ success: false, message: 'Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement par téléphone.' });
      console.error('Erreur EmailJS:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Contactez-nous</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Nous sommes à votre écoute pour tous vos projets de création vidéo et motion design.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                Nom
              </label>
              <div className="mt-2.5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                Email
              </label>
              <div className="mt-2.5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                Message
              </label>
              <div className="mt-2.5">
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
          
          {status.message && (
            <div className={`mt-4 text-sm ${status.success ? 'text-green-600' : 'text-red-600'}`}>
              {status.message}
            </div>
          )}
          
          <div className="mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Contact;