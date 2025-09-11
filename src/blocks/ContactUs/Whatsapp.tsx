"use client";

import React from "react";

export const WhatsApp = ({ chatLink }: { chatLink: string }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hi! I'm interested in your web development services."
    );
    const phoneNumber = "2347082642998";

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const whatsappUrl = isMobile
      ? `whatsapp://send?phone=${phoneNumber}&text=${message}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <a
      onClick={handleWhatsAppClick}
      href="#"
      className="font-semibold text-white hover:underline"
    >
      {chatLink}
    </a>
  );
};
