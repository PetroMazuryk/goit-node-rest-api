import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.join("db", "contacts.json");

const updateListContacts = async (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const getAllContacts = await listContacts();
  const result = getAllContacts.find(({ id }) => id === contactId);
  return result || null;
};

export const removeContact = async (contactId) => {
  const getAllContacts = await listContacts();
  const index = getAllContacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = getAllContacts.splice(index, 1);
  await updateListContacts(getAllContacts);
  return result;
};

export const addContact = async (name, email, phone) => {
  const getAllContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  getAllContacts.push(newContact);
  await updateListContacts(getAllContacts);
  return newContact;
};

export const updateContactById = async (id, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id, ...body };
  await updateListContacts(contacts);
  return contacts[index];
};
