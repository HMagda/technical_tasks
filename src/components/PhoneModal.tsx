import React, {useState} from 'react';
import ReactModal from 'react-modal';
import Select from 'react-select';
import {useQuery} from 'react-query';

interface Country {
  country_name: string;
  dialling_code: string;
}

const PhoneModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{
    value: string;
    label: string;
    dialling_code: string;
  } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchCountryCodes = async () => {
    const res = await fetch(
      `http://apilayer.net/api/countries?access_key=${process.env.REACT_APP_NUMVERIFY_API_KEY}`
    );
    const data = await res.json();
    return Object.entries(data).map(([code, country]) => ({
      code,
      name: (country as Country).country_name,
      dialling_code: (country as Country).dialling_code,
    }));
  };

  const {data: countryCodes, status} = useQuery(
    'countryCodes',
    fetchCountryCodes
  );

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCancel = () => {
    setSelectedCountry(null);
    setPhoneNumber('');
    setModalIsOpen(false);
  };

  const handleSave = () => {
    setModalIsOpen(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error fetching data</div>;
  }

  let options: {value: string; label: string; dialling_code: string}[] = [];

  if (countryCodes) {
    options = countryCodes.map(
      (country: {code: string; name: string; dialling_code: string}) => ({
        value: country.code,
        label: `${country.name} (${country.dialling_code})`,
        dialling_code: country.dialling_code,
      })
    );
  }

  return (
    <div>
      <button onClick={handleOpenModal}>Change phone number</button>

      <ReactModal
        isOpen={modalIsOpen}
        style={{
          content: {
            overflow: 'hidden',
          },
        }}
      >
        <Select
          options={options}
          value={selectedCountry}
          onChange={(
            option: {value: string; label: string; dialling_code: string} | null
          ) => setSelectedCountry(option)}
          isSearchable
          menuPortalTarget={document.body}
          styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
        />

        <input
          type='phone'
          placeholder='000-000-000'
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />

        <button onClick={handleCancel}>Cancel</button>
        <button onClick={handleSave}>Save</button>
      </ReactModal>
    </div>
  );
};

export default PhoneModal;
