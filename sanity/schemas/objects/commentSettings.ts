import { defineField, defineType } from "sanity";

export default defineType({
  name: "commentSettings",
  title: "Comment Settings",
  type: "object",
  fields: [
    defineField({
      name: "globallyEnabled",
      title: "Enable Comments Globally",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "approvalMode",
      title: "Approval Mode",
      type: "string",
      options: {
        list: [
          { title: "Manual Approval", value: "manual" },
          { title: "Auto Approve", value: "automatic" },
        ],
      },
      initialValue: "manual",
    }),
    defineField({
      name: "enableHoneypot",
      title: "Enable Honeypot Spam Protection",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "enableCaptcha",
      title: "Enable CAPTCHA",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "captchaProvider",
      title: "CAPTCHA Provider",
      type: "string",
      options: {
        list: [
          { title: "None", value: "none" },
          { title: "reCAPTCHA", value: "recaptcha" },
          { title: "hCaptcha", value: "hcaptcha" },
        ],
      },
      hidden: ({ parent }) => !parent?.enableCaptcha,
      initialValue: "none",
    }),
    defineField({
      name: "captchaSiteKey",
      title: "CAPTCHA Site Key",
      type: "string",
      hidden: ({ parent }) => !parent?.enableCaptcha,
    }),
  ],
});
