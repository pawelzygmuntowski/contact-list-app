import React from 'react';
import axios from 'axios';
import {useQuery} from '@tanstack/react-query';
import {Contact} from '../util/types';
import {usePrevious} from '../util/usePrevious';
import {ContactListItem} from '../components/ContactListItem';

export function Contacts() {
  const [selectedContactIds, setSelectedContactIds] = React.useState<number[]>([]);
  const [foundContacts, setFoundContacts] = React.useState<Contact[]>([]);
  const [sortedContacts, setSortedContacts] = React.useState<Contact[]>([]);
  const previousContactIds = usePrevious<number[]>(selectedContactIds);

  const getContacts = (): Promise<Contact[]> =>
    axios.get('https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json').then((response) => {
      return response.data;
    });

  const updateContactIds = (toggledContactId: number): void => {
    setSelectedContactIds(
      selectedContactIds.includes(toggledContactId)
        ? selectedContactIds.filter((contactId) => contactId !== toggledContactId)
        : [...selectedContactIds, toggledContactId],
    );
  };

  const filterContacts = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const keyword = event.target.value;

    if (keyword !== '' && data) {
      const filteredResults = data.filter((contact) => {
        return (
          contact.first_name.toLowerCase().startsWith(keyword.toLowerCase()) ||
          contact.last_name.toLowerCase().startsWith(keyword.toLowerCase())
        );
      });
      setFoundContacts(filteredResults);
    } else {
      setFoundContacts(data ?? []);
    }
  };

  const sortContacts = (contacts: Contact[]): Contact[] =>
    contacts?.sort((a, b) => a.last_name.localeCompare(b.last_name));

  const {data, error, isFetching} = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
    staleTime: 5,
  });

  React.useEffect(() => {
    if (previousContactIds === undefined || previousContactIds === selectedContactIds) {
      return;
    }
    console.log(selectedContactIds.join('\n'));
  }, [selectedContactIds, previousContactIds]);

  React.useEffect(() => {
    if (data) {
      setFoundContacts(data);
    }
  }, [data]);

  React.useEffect(() => {
    if (foundContacts) {
      setSortedContacts(sortContacts(foundContacts));
    }
  }, [foundContacts]);

  return (
    <div>
      <div className="relative mt-5 px-5">
        <input
          type="text"
          id="password"
          className="w-full pl-3 pr-10 py-2 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
          placeholder="Filter by first and last name"
          onChange={filterContacts}
        />
      </div>
      <>
        {error && (
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mt-10 max-w-prose text-lg">
              <h1>
                <span className="block text-center text-lg font-semibold text-indigo-600">Could not fetch data</span>
              </h1>
            </div>
          </div>
        )}
        {isFetching ? (
          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mt-10 max-w-prose text-lg">
              <h1>
                <span className="block text-center text-lg font-semibold text-indigo-600">Fetching data...</span>
              </h1>
            </div>
          </div>
        ) : (
          <div className="mt-8 px-5 flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {sortedContacts.map((contact) => (
                <ContactListItem
                  key={contact.id}
                  contact={contact}
                  selectedContactIds={selectedContactIds}
                  updateContactIds={updateContactIds}
                />
              ))}
            </ul>
          </div>
        )}
      </>
    </div>
  );
}
