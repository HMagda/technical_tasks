import React, { useState, useCallback } from 'react';
import {useQuery} from 'react-query';
import {FlagIcon, FlagIconCode} from 'react-flag-kit';
import './PhoneModal.modules.scss';

interface Country {
  code: string;
  country_name: string;
  dialling_code: string;
}

interface SelectOption {
  value: string;
  dial_code: string;
  flag: string;
}

const fetchCountryCodes = async () => {
  const { REACT_APP_NUMVERIFY_API_KEY } = process.env;
  const res = await fetch(`http://apilayer.net/api/countries?access_key=${REACT_APP_NUMVERIFY_API_KEY}`);
  const data = await res.json();

  return Object.entries(data).map(([code, country]) => ({
    code,
    name: (country as Country).country_name,
    dial_code: (country as Country).dialling_code,
  }));
};

const PhoneModal: React.FC<{
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setModalIsOpen }) => {
  const defaultPolandData: SelectOption = {
    value: 'Poland',
    dial_code: '+48',
    flag: 'PL',
  };

  const [selectedCountry, setSelectedCountry] =
    useState<SelectOption>(defaultPolandData);

  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [search, setSearch] = useState<string>('');
  const [active, setActive] = useState<boolean>(false);

  const {
    data: countryCodes,
    isLoading,
    isError,
  } = useQuery('countryCodes', fetchCountryCodes);

  let options: SelectOption[] = [];

  if (countryCodes) {
    options = countryCodes
      .filter((country) => country.code !== 'AN')
      .map((country) => {
        const option = {
          value: country.name,
          dial_code: country.dial_code,
          flag: country.code,
        };
        const polandData = options.find((option) => option.flag === 'PL');
        if (polandData) {
          setSelectedCountry(polandData);
        }
        return option;
      });

    const toggleActive = () => {
      setActive(!active);
    };

    const updateName = (option: SelectOption) => {
      setSearch('');
      setSelectedCountry(option);
      setActive(false);
    };

    const handleCancel = () => {
      setPhoneNumber('');
      setModalIsOpen(false);
    };

    const handleSave = () => {
      setModalIsOpen(false);
    };

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (isError) {
      return <div>Error fetching data</div>;
    }

    return (
      <div className='modal-wrapper'>
        <div className='modal-container'>
          <h1>Change phone number</h1>
          <h2>Provide new phone number</h2>

          <div className='phone-input-wrapper'>
            <div className='select-btn' onClick={toggleActive}>
              {selectedCountry ? (
                <>
                  <div className='flag-container'>
                    <FlagIcon
                      code={selectedCountry.flag as FlagIconCode}
                      width={22}
                      height={16}
                    />
                  </div>
                  <span className='dial-code'>{selectedCountry.dial_code}</span>
                </>
              ) : (
                <>
                  <div className='flag-container'>
                    <FlagIcon
                      code={defaultPolandData.flag as FlagIconCode}
                      width={22}
                      height={16}
                    />
                  </div>

                  <span className='dial-code'>
                    {defaultPolandData.dial_code}
                  </span>
                </>
              )}

              {active ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                >
                  <path
                    d='M11.4 8.39999L5.99998 2.99999L0.599976 8.39999'
                    stroke='#8F90A6'
                    strokeWidth='1.1'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='12'
                  height='12'
                  viewBox='0 0 12 12'
                  fill='none'
                >
                  <path
                    d='M11.4 3.60001L6 9.00001L0.599998 3.60001'
                    stroke='#8F90A6'
                    strokeWidth='1.1'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              )}
            </div>

            <div className='phone-input-container'>
              <input
                id="phoneNumber"
                name="phoneNumber"
                className='phone-input'
                type='phone'
                placeholder='000-000-000'
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </div>
          </div>
        </div>

        {active && (
          <div className={`wrapper ${active ? 'active' : ''}`}>
            <div className='dropdown'>
              <div className='search'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 18 18'
                  fill='none'
                >
                  <path
                    d='M8.22608 14.4183C11.646 14.4183 14.4184 11.6459 14.4184 8.22605C14.4184 4.80616 11.646 2.03378 8.22608 2.03378C4.80619 2.03378 2.03381 4.80616 2.03381 8.22605C2.03381 11.6459 4.80619 14.4183 8.22608 14.4183Z'
                    stroke='#5870E0'
                    strokeWidth='1.1'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M15.9662 15.9659L12.5991 12.5989'
                    stroke='#5870E0'
                    strokeWidth='1.1'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <input
                  spellCheck='false'
                  type='text'
                  placeholder='Search...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ul className='options'>
                {options
                  .filter((option) =>
                    option?.value
                      ?.toLowerCase()
                      .startsWith(search.toLowerCase())
                  )
                  .map((option, index) => (
                    <li
                      key={index}
                      className={option === selectedCountry ? 'selected' : ''}
                      onClick={() => updateName(option)}
                    >
                      <div className='country-option'>
                        <div className='flag-container'>
                          <FlagIcon
                            code={option.flag as FlagIconCode}
                            width={22}
                            height={16}
                          />
                        </div>
                        <span className='country-name'> {option.value}</span>
                      </div>

                      <span className='country-code'>{option.dial_code}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        <div className='btn-container'>
          <button onClick={handleCancel} className='btn cancel'>
            Cancel
          </button>
          <button onClick={handleSave} className='btn save'>
            Save
          </button>
        </div>
      </div>
    );
  }
  return null;
};

export default PhoneModal;
