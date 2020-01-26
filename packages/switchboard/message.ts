export default interface Message {
  mail_from: string;
  rcpt_to: string[];
  data: string;
};
