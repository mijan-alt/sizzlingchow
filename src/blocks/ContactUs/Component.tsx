
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";



import type { ContactUs } from "@/payload-types";




const ContactUs = ({
  title = "Contact Us",
  description = "Contact the support team at Shadcnblocks.",
  emailLabel = "Email",
  emailDescription = "We respond to all emails within 24 hours.",
  email = "example@shadcnblocks.com",
  officeLabel = "Office",
  officeDescription = "Drop by our office for a chat.",
  officeAddress = "1 Eagle St, Brisbane, QLD, 4000",
  phoneLabel = "Phone",
  phoneDescription = "We're available Mon-Fri, 9am-5pm.",
  phone = "+123 456 7890",
  chatLabel = "Live Chat",
  chatDescription = "Get instant help from our support team.",
  chatLink = "Start Chat",
}: ContactUs) => {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto ">
        <div className="mb-14">
          <h1 className="mb-3 mt-2 text-balance text-3xl font-semibold md:text-4xl">
            {title}
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            {description}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-secondary rounded-lg p-6">
            <span className="bg-primary mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <Mail className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg text-white font-semibold">{emailLabel}</p>
            <p className="text-white mb-3">{emailDescription}</p>
            <a
              href={`mailto:${email}`}
              className="font-semibold text-white hover:underline"
            >
              {email}
            </a>
          </div>
          <div className="bg-secondary rounded-lg p-6">
            <span className="bg-primary mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <MapPin className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg text-white font-semibold">{officeLabel}</p>
            <p className="text-white mb-3">{officeDescription}</p>
            <a href="#" className="font-semibold text-white hover:underline">
              {officeAddress}
            </a>
          </div>
          <div className="bg-secondary rounded-lg p-6">
            <span className="bg-primary mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <Phone className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg text-white font-semibold">{phoneLabel}</p>
            <p className="text-white mb-3">{phoneDescription}</p>
            <a href={`tel:${phone}`} className="font-semibold text-white hover:underline">
              {phone}
            </a>
          </div>
          <div className="bg-secondary rounded-lg p-6">
            <span className="bg-primary mb-3 flex size-12 flex-col items-center justify-center rounded-full">
              <MessageCircle className="h-6 w-auto" />
            </span>
            <p className="mb-2 text-lg text-white font-semibold">{chatLabel}</p>
            <p className="text-white  mb-3">{chatDescription}</p>
                <a
   
               href="#"
                className="font-semibold text-white hover:underline"
    >
      {chatLink}
    </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ContactUs };
