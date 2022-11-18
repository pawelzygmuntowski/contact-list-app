import React from 'react';
import {Contact} from '../util/types';

interface ContactListItemProps {
  contact: Contact;
  selectedContactIds: number[];
  updateContactIds: (contactId: number) => void;
}

export const ContactListItem: React.FC<ContactListItemProps> = (props: ContactListItemProps) => {
  const {contact, selectedContactIds, updateContactIds} = props;

  const getContactInitials = (): string => {
    return `${contact.first_name.charAt(0)}${contact.last_name.charAt(0)}`;
  };

  return (
    <li
      key={contact.id}
      className="py-4 hover:bg-gray-50 cursor-pointer"
      onClick={() => {
        updateContactIds(contact.id);
      }}
    >
      <div className="flex items-center space-x-4 mx-5">
        <div className="flex-shrink-0">
          {contact.avatar ? (
            <img className="inline-block h-8 w-8 rounded-full" src={contact.avatar} alt="" />
          ) : (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
              <span className="text-sm font-medium leading-none text-white">{getContactInitials()}</span>
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">
            {contact.first_name} {contact.last_name}
          </p>
        </div>
        <div>
          <input
            id="log-id"
            name="log-id"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 accent-indigo-500 text-indigo-600 focus:ring-indigo-500"
            checked={selectedContactIds.includes(contact.id)}
            readOnly
          />
        </div>
      </div>
    </li>
  );
};
