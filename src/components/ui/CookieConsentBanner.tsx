'use client';

import React from 'react';
import CookieConsent from "react-cookie-consent";

const CookieConsentBanner = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="J'accepte les cookies"
      cookieName="gaia-consent-mandatory-cookies"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#fff", backgroundColor: "#4caf50", fontSize: "13px", padding: "8px 16px", borderRadius: "4px" }}
      expires={150}
      enableDeclineButton={false} // Pas de bouton de refus puisque les cookies sont obligatoires
    >
      Ce site utilise des cookies essentiels pour l'authentification, la protection CSRF et 
      l'analyse de performances via Vercel Analytics et Speed Insights.{" "}
      <a href="/about" style={{ color: "#fff" }}> (En savoir plus ?)</a>
    </CookieConsent>
  );
};

export default CookieConsentBanner;