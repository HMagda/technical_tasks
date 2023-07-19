import React, {useState} from 'react';
import ReactModal from 'react-modal';
import Select, {OptionProps, components} from 'react-select';
import {useQuery} from 'react-query';
import {FlagIcon, FlagIconCode} from 'react-flag-kit';

interface Country {
  code: string;
  country_name: string;
  dialling_code: string;
}

interface SelectOption {
  value: string;
  label: string;
  dial_code: string;
  flag: string;
}

const CustomOption: React.FC<OptionProps<SelectOption, false>> = (props) => (
  <components.Option {...props}>
    <FlagIcon code={props.data.flag as FlagIconCode} />
    <span>{props.data.label}</span>
  </components.Option>
);

const PhoneModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(
    null
  );
  const [phoneNumber, setPhoneNumber] = useState('');

  const fetchCountryCodes = async () => {
    const res = await fetch(
      `http://apilayer.net/api/countries?access_key=${process.env.REACT_APP_NUMVERIFY_API_KEY}`
    );
    const data = await res.json();

    return Object.entries(data).map(([code, country]) => ({
      code,
      name: (country as Country).country_name,
      dial_code: (country as Country).dialling_code,
    }));
  };

  const {data: countryCodes, status} = useQuery(
    'countryCodes',
    fetchCountryCodes
  );

  let options: SelectOption[] = [];

  if (countryCodes) {
    console.log('halo', countryCodes)
    options = countryCodes
      .filter((country) => country.code !== 'AN')
      .map((country) => ({
        value: country.name,
        label: `${country.name} (${country.dial_code})`,
        dial_code: country.dial_code,
        flag: country.code,
      }));
  }

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCancel = () => {
    setSelectedCountry(null);
    setPhoneNumber('');
    setModalIsOpen(false);
  };

  const handleSave = () => {
    // Add save functionality here.
    setModalIsOpen(false);
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'error') {
    return <div>Error fetching data</div>;
  }

  return (
    <div className='modal-container'>
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
          onChange={(option) => setSelectedCountry(option)}
          isSearchable
          menuPortalTarget={document.body}
          styles={{menuPortal: (base) => ({...base, zIndex: 9999})}}
          components={{Option: CustomOption}}
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
