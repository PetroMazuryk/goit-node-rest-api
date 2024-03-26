const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "db/contacts.json");

const updateListContacts = async (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const getAllContacts = await listContacts();
  const result = getAllContacts.find(({ id }) => id === contactId);
  return result || null;
};

const removeContact = async (contactId) => {
  const getAllContacts = await listContacts();
  const index = getAllContacts.findIndex(({ id }) => id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = getAllContacts.splice(index, 1);
  await updateListContacts(getAllContacts);
  return result;
};

const addContact = async (name, email, phone) => {
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

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
