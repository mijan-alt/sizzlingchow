import type { Block } from 'payload';

export const ContactUsBlock: Block = {
  slug: 'contactUs',
  interfaceName: 'contactUs',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Contact Us',
    },
    {
      name: 'description',
      type: 'text',
      defaultValue: 'Contact the support team at Shadcnblocks.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'emailLabel',
          type: 'text',
          defaultValue: 'Email',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'text',
          defaultValue: 'example@shadcnblocks.com',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'emailDescription',
      type: 'text',
      defaultValue: 'We respond to all emails within 24 hours.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'officeLabel',
          type: 'text',
          defaultValue: 'Office',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'officeAddress',
          type: 'text',
          defaultValue: '1 Eagle St, Brisbane, QLD, 4000',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'officeDescription',
      type: 'text',
      defaultValue: 'Drop by our office for a chat.',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phoneLabel',
          type: 'text',
          defaultValue: 'Phone',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'phone',
          type: 'text',
          defaultValue: '+123 456 7890',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'phoneDescription',
      type: 'text',
      defaultValue: "We're available Mon-Fri, 9am-5pm.",
    },
    {
      type: 'row',
      fields: [
        {
          name: 'chatLabel',
          type: 'text',
          defaultValue: 'Live Chat',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'chatLink',
          type: 'text',
          defaultValue: 'Start Chat',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'chatDescription',
      type: 'text',
      defaultValue: 'Get instant help from our support team.',
    },
  ],
};