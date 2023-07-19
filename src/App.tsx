import React from 'react';
import PhoneModal from './components/PhoneModal/PhoneModal';
import './App.scss';

type TestIdsFunction = () => string;
type TestIdsValues = string | TestIdsFunction;

type TestIdsType<T> = {
  [P in keyof T]: T[P] extends (...args: any[]) => infer R
    ? R extends string
      ? T[P]
      : TestIdsValues
    : T[P] extends object
    ? Object extends T[P]
      ? TestIdsValues
      : TestIdsType<T[P]>
    : T[P] extends TestIdsValues
    ? T[P]
    : never;
};

function typedFreeze<T extends TestIdsType<T>>(obj: T): Readonly<T> {
  return Object.freeze(obj);
}

// This should pass
const TEST_1 = typedFreeze({
  key1: {
    key2: 'example1',
    key3: {
      key4: 'example2',
    },
  },
  key5: () => 'example3',
} as const);

// This shouldn't pass (will cause a compile error)
// const TEST_2 = typedFreeze({
//   key1: {
//     key2:  "example1",
//     key3: {
//       key4: "example2"
//     }
//   },
//   key5:  () => 10,
// } as const);

// This shouldn't pass (will cause a compile error)
// const TEST_3 = typedFreeze({
//   key1: {
//     key2:  "example1",
//     key3: {
//       key4: "example2"
//     }
//   },
//   key5:  {},
// } as const);

const App = () => {
  return (
    <div className='App'>
      <PhoneModal />
    </div>
  );
};

export default App;
